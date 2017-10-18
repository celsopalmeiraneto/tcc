"use strict";
const SoccerMatchCBF = require("./SoccerMatchCBF.js");
const moment = require("moment");

const AbstractMapper = require("./AbstractMapper.js");


const dateFields = [
  "LastUpdate",
  "StartDateTime"
];


exports.getMatchById = async function(id) {
  return await AbstractMapper.getById(id, exports.mapDBAnswerToClassObject);
};

exports.updateMatch = async function(oMatch){
  oMatch.LastUpdate = new Date();
  oMatch.UpdateSource  = "Soccer Match Crawler";

  return await AbstractMapper.update(oMatch, dateFields);
};

exports.insertMatch = async function(oMatch){
  oMatch.LastUpdate = new Date();
  oMatch.UpdateSource  = "Soccer Match Crawler";

  return await AbstractMapper.insert(oMatch, dateFields);
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
