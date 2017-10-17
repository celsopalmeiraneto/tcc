"use strict";

const DBConnector = require("./DBConnector.js");
const Peson       = require("./Person.js");

const db = DBConnector.getPouchDBConnection();

exports.getPersonByFullName = async function (Fullname) {
  var res = await db.query("VenueDocs/venueByNameCity", {
    key : Fullname
  });
  if(res.rows.length > 0){
    return exports.mapDBAnswerToClassObject(res.rows[0]);
  }
  return null;
};

exports.insertPerson = function(oPerson) {
  
};

exports.mapDBAnswerToClassObject = function (answer) {
  var person = new Person();

  Object.keys(answer).forEach((key) => {
    person[key] = answer[key];
  });

  return person;
};
