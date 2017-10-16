"use strict";
const DBConnector = require("./DBConnector.js");
const SoccerMatchCBF = require("./SoccerMatchCBF.js");
const moment = require("moment");

const db = DBConnector.getPouchDBConnection();


exports.getMatchById = async function (id) {
  let doc;
  try{
    doc = await db.get(id);
  }catch(e){
    return null;
  }

  if(doc){
    return exports.mapDBAnswerToClassObject(doc);
  }
  return null;
};

exports.updateMatch = async function(oMatch){
  oMatch.LastUpdate = new Date().toISOString();
  oMatch.StartDateTime = oMatch.StartDateTime.toISOString();
  oMatch.UpdateSource  = "Soccer Match Crawler";

  if(!oMatch.hasOwnProperty("_rev") || oMatch.hasOwnProperty("_rev") && !oMatch._rev){
    let tempMatch = await exports.getMatchById(oMatch._id);
    oMatch._rev = tempMatch._rev;
    tempMatch = null;
  }

  var response = await db.put(oMatch);
  if(response.ok){
    oMatch._rev = response.rev;
    oMatch.LastUpdate = moment(oMatch.LastUpdate);
    oMatch.StartDateTime = moment(oMatch.StartDateTime);
    return oMatch;
  }else{
    throw new Error("Failed to update match."+JSON.stringify(response));
  }
};

exports.insertMatch = async function(oMatch){
  oMatch.LastUpdate = new Date().toISOString();
  oMatch.StartDateTime = oMatch.StartDateTime.toISOString();
  oMatch.UpdateSource  = "Soccer Match Crawler";

  let res = await db.put(oMatch);

  if(res.ok){
    oMatch.LastUpdate = moment(oMatch.LastUpdate);
    oMatch.StartDateTime = moment(oMatch.StartDateTime);
    return oMatch;
  }else{
    throw new Error("Error inserting new Match. Server response: " + JSON.stringify(res));
  }
};

exports.compareMatchByIdCRC32 = async function(oMatch){
  let matchOnDatabase = exports.getMatchById(oMatch._id);
  return matchOnDatabase.crc32 == oMatch.crc32;
};

exports.mapDBAnswerToClassObject = function(answerObject){
  let soccerMatch = new SoccerMatchCBF();

  soccerMatch._id   = answerObject._id;
  soccerMatch._rev  = answerObject._rev;

  soccerMatch.HomeTeamId = answerObject.HomeTeamId;
  soccerMatch.AwayTeamId = answerObject.AwayTeamId;

  soccerMatch.StartDateTime = moment(answerObject.StartDateTime);
  soccerMatch.VenueId = answerObject.VenueId;
  soccerMatch.HomeTeamScore = answerObject.HomeTeamScore;
  soccerMatch.AwayTeamScore = answerObject.AwayTeamScore;

  soccerMatch.ChampionshipId = answerObject.ChampionshipId;

  soccerMatch.SeasonMatchNumber = answerObject.gameCode;
  soccerMatch.Round = answerObject.roundName;

  return soccerMatch;
};
