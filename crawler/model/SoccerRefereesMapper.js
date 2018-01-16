"use strict";

const AbstractMapper = require("./AbstractMapper.js");
const SoccerReferees = require("./SoccerReferees.js");

const moment      = require("moment");
const util        = require("../util.js");

const dateFields = ["LastUpdate"];


exports.getSoccerRefereesById = async function(sSoccerRefereesId){
  return await AbstractMapper.getById(sSoccerRefereesId, exports.mapDBAnswerToClassObject);
};

exports.insertSoccerReferees = async function(oSoccerReferees){
  if(!oSoccerReferees._id){
    oSoccerReferees._id = "referees"+util.removeSpacesFromStrings(oSoccerReferees.MatchId);
  }
  oSoccerReferees.LastUpdate = new Date();
  oSoccerReferees.UpdateSource = "Soccer Referees Crawler";

  return await AbstractMapper.insert(oSoccerReferees, dateFields);
};

exports.updateSoccerReferees = async function(oSoccerReferees){
  oSoccerReferees.LastUpdate = new Date();
  oSoccerReferees.UpdateSource = "Soccer Referees Crawler";

  return await AbstractMapper.update(oSoccerReferees, dateFields);
};

exports.mapDBAnswerToClassObject = function(answer){
  var oSoccerReferees = new SoccerReferees();

  Object.keys(answer).forEach((key) => {
    if(dateFields.includes(key)){
      oSoccerReferees[key] = moment(answer[key]);
    }else{
      oSoccerReferees[key] = answer[key];
    }
  });

  return oSoccerReferees;
};
