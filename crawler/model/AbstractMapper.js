"use strict";

const DBConnector = require("./DBConnector.js");
const moment      = require("moment");

const db = DBConnector.getPouchDBConnection();


exports.getById = async function(id, mapperFunction){
  if(typeof id !== "string" || typeof id === "string" && id.trim() === "")
    throw new Error("ID must be a non-empty string.");

  if(typeof mapperFunction !== "function")
    throw new Error("mapperFunction must be a function");

  let obj = null;
  try {
    obj = await db.get(id);
    obj = mapperFunction.call(null, obj);
  } catch (e) {
    //empty block on purpose!!!
  }
  return obj;
};

exports.update = async function(oObj, aDateFields){
  oObj = dateFieldsToString(oObj, aDateFields);

  if(!oObj.hasOwnProperty("_rev") || oObj.hasOwnProperty("_rev") && !oObj._rev){
    let tempMatch = await db.get(oObj._id);
    oObj._rev = tempMatch._rev;
    tempMatch = null;
  }

  var response = await db.put(oObj);
  if(response.ok){
    oObj._rev = response.rev;
    return stringToDateFields(oObj, aDateFields);
  }else{
    throw new Error("Failed to update."+JSON.stringify(response));
  }
};

exports.insert = async function(oObj, aDateFields){
  oObj = dateFieldsToString(oObj, aDateFields);

  let res = await db.put(oObj);

  if(res.ok){
    return stringToDateFields(oObj, aDateFields);
  }else{
    throw new Error("Error inserting new Match. Server response: " + JSON.stringify(res));
  }
};


function dateFieldsToString(oObj, aDateFields){
  aDateFields.forEach((field) => {
    if(oObj[field] != null)
      oObj[field] = oObj[field].toISOString();
  });
  return oObj;
}

function stringToDateFields(oObj, aDateFields){
  aDateFields.forEach((field) => {
    if(oObj[field] != null)
      oObj[field] = moment(oObj[field]);
  });
  return oObj;
}
