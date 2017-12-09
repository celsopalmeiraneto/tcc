"use strict";

const Venue = require("./Venue.js");
const DBConnector = require("./DBConnector.js");
const moment = require("moment");
const util   = require("../util.js");

const db = DBConnector.getPouchDBConnection();


exports.findVenueByNameAndCity = async function (name, city){
  var res;
  try{
    res = await db.query("VenueDocs/venueByNameCity", {
      include_docs : true,
      key : [name, city],
      limit : 1
    });
  }catch(e){
    throw e;
  }

  if(res.rows.length > 0){
    return mapDBAnswerToClassObject(res.rows[0].doc);
  }
  return null;
};

exports.insertVenue = async function (oVenue){
  var newVenue = JSON.parse(JSON.stringify(oVenue));
  newVenue._id = util.removeSpacesFromStrings("venue"+newVenue.Name+newVenue.City);
  newVenue.LastUpdate = (new Date()).toISOString();

  let res = await db.put(newVenue);
  if(!res.ok){
    throw new Error("Error inserting new venue. Server response: " + JSON.stringify(res));
  }

  return newVenue;
};

function mapDBAnswerToClassObject(answerObject){
  let venue = new Venue();

  venue._id  = answerObject._id;

  venue.Name = answerObject.Name;
  venue.City = answerObject.City;
  venue.State = answerObject.State;
  venue.Country = answerObject.Country;
  venue.LastUpdate = moment(answerObject.LastUpdate);
  venue.UpdateSource = answerObject.UpdateSource;

  return venue;
}
