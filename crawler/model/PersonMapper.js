"use strict";

const DBConnector = require("./DBConnector.js");
const AbstractMapper = require("./AbstractMapper.js");
const Person      = require("./Person.js");
const moment      = require("moment");
const util        = require("../util.js");

const db = DBConnector.getPouchDBConnection();

const dateFields = ["LastUpdate", "DateOfBirth"];

exports.getPersonByFullName = async function (Fullname){
  var res = await db.query("PersonDocs/personByFullname", {
    key : Fullname
  });
  if(res.rows.length > 0){
    return exports.mapDBAnswerToClassObject(res.rows[0].doc);
  }
  return null;
};

exports.getPersonById = async function(sPersonId){
  return await AbstractMapper.getById(sPersonId, exports.mapDBAnswerToClassObject);
};

exports.insertPerson = async function(oPerson){
  if(!oPerson._id){
    oPerson._id = "person"+util.removeSpacesFromStrings(oPerson.Fullname);
  }
  oPerson.LastUpdate = new Date();
  oPerson.UpdateSource = "Person Crawler";

  return await AbstractMapper.insert(oPerson, dateFields);
};

exports.updatePerson = async function(oPerson){
  oPerson.LastUpdate = new Date();
  oPerson.UpdateSource = "Person Crawler";

  return await AbstractMapper.update(oPerson, dateFields);
};

exports.mapDBAnswerToClassObject = function(answer){
  var person = new Person();

  Object.keys(answer).forEach((key) => {
    if("DateOfBirth, LastUpdate,".includes(`${key},`)){
      person[key] = moment(answer[key]);
    }else{
      person[key] = answer[key];
    }
  });

  return person;
};
