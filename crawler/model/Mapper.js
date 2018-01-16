"use strict";

const DBConnector = require("./DBConnector.js");
const moment      = require("moment");

const db = DBConnector.getPouchDBConnection();

class Mapper {
  constructor(mapperClass) {
    if(!mapperClass) throw new Error("mapperClass must be set.");
    this.mapperClass = mapperClass;
    this.dateFields = [];
  }

  async byId(id){
    if(typeof id !== "string" || typeof id === "string" && id.trim() === "")
      throw new Error("ID must be a non-empty string.");

    let obj = null;
    try {
      obj = await db.get(id);
      return this.mapObjectToClassInstance(obj);
    } catch (e) {
      //empty block on purpose!!!
    }
  }

  async indexedQuery(index, key){
    if(index == null || key == null) return false;

    try{
      let res = await db.query(index, {
        key: key,
        include_docs: true
      });
      if(res.rows.length > 0){
        return res.rows.map(v => {
          return _mapObjectToClassInstance(v);
        });
      }else{
        return [];
      }
    }catch(e){
      throw e;
    }

  }

  async insert(oObj){
    oObj = this._dateFieldsToString(oObj);

    let res = await db.put(oObj);

    if(res.ok){
      return this._stringToDateFields(oObj);
    }else{
      throw new Error("Error inserting new Match. Server response: " + JSON.stringify(res));
    }
  }

  async mangoQuery(selector){
    let response = await db.find({
      selector: {...selector}
    });

    if(response && response.docs && response.docs.length > 0){
      return response.docs.map(v => {
        return this._mapObjectToClassInstance(v);
      });
    }else{
      return [];
    }
  }

  async update(oObj, checkCRC32 = true){
    let onDBDocument = await db.get(oObj._id);

    if(!oObj.hasOwnProperty("_rev") || oObj.hasOwnProperty("_rev") && !oObj._rev){
      oObj._rev = onDBDocument._rev;
    }

    if(checkCRC32 && onDBDocument && oObj.crc32 && onDBDocument.crc32 == oObj.crc32){
      return oObj;
    }

    oObj = this._dateFieldsToString(oObj);

    var response = await db.put(oObj);
    if(response.ok){
      oObj._rev = response.rev;
      return this._stringToDateFields(oObj);
    }else{
      throw new Error("Failed to update."+JSON.stringify(response));
    }
  }

  _dateFieldsToString(oObj){
    this.dateFields.forEach((field) => {
      if(oObj[field] != null)
        oObj[field] = oObj[field].toISOString();
    });
    return oObj;
  }

  _mapObjectToClassInstance(dbObject){
    var oInstance = new this.mapperClass();

    Object.keys(dbObject).forEach((key) => {
      if(this.dateFields.includes(key)){
        oInstance[key] = moment(dbObject[key]);
      }else{
        oInstance[key] = dbObject[key];
      }
    });


    return oInstance;
  }

  _stringToDateFields(oObj){
    this.dateFields.forEach((field) => {
      if(oObj[field] != null)
        oObj[field] = moment(oObj[field]);
    });
    return oObj;
  }


}

module.exports = Mapper;
