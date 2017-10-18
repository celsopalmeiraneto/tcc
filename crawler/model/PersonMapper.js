"use strict";

const DBConnector = require("./DBConnector.js");
const Person      = require("./Person.js");
const moment      = require("moment");

const db = DBConnector.getPouchDBConnection();

exports.getPersonByFullName = async function (Fullname){
  var res = await db.query("VenueDocs/venueByNameCity", {
    key : Fullname
  });
  if(res.rows.length > 0){
    return exports.mapDBAnswerToClassObject(res.rows[0]);
  }
  return null;
};

exports.getPersonById = async function(sPersonId){
  let person = null;
  try {
    person = await db.get(sPersonId);
    person = exports.mapDBAnswerToClassObject(person);
  } catch (e) {
    //empty block on purpose!!!
  }
  return person;
};

exports.insertPerson = async function(oPerson){
  oPerson.LastUpdate = new Date().toISOString();
  oPerson.DateOfBirth = oPerson.DateOfBirth.toISOString();
  oPerson.UpdateSource = "Person Crawler";

  let res = await db.put(oPerson);
  if(res.ok){
    oPerson.LastUpdate = moment(oPerson.LastUpdate);
    oPerson.DateOfBirth = moment(oPerson.DateOfBirth);
    return oPerson;
  }else{
    throw res;
  }
};

exports.updatePerson = async function(oPerson){
  oPerson.LastUpdate = new Date().toISOString();
  oPerson.DateOfBirth = oPerson.DateOfBirth.toISOString();
  oPerson.UpdateSource = "Person Crawler";


  if(!oPerson.hasOwnProperty("_rev") || oPerson.hasOwnProperty("_rev") && !oPerson._rev){
    let tempPerson = await exports.getPersonById(oPerson._id);
    oPerson._rev = tempPerson._rev;
    tempPerson = null;
  }

  let res = await db.put(oPerson);
  if(res.ok){
    oPerson.LastUpdate = moment(oPerson.LastUpdate);
    oPerson.DateOfBirth = moment(oPerson.DateOfBirth);
    return oPerson;
  }else{
    throw res;
  }
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
