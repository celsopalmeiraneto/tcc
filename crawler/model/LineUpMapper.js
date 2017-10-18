"use strict";

const LineUp = require("./LineUp.js");
const AbstractMapper = require("./AbstractMapper.js");
const moment = require("moment");


const dateFields = ["LastUpdate"];


exports.getLineUpById = async function(sLineUpId){
  return await AbstractMapper.getById(sLineUpId, exports.mapDBAnswerToClassObject);
};

exports.insertLineUp = async function(oLineUp){
  oLineUp.LastUpdate = new Date();
  oLineUp.UpdateSource = "LineUp Crawler";

  return await AbstractMapper.insert(oLineUp, dateFields);
};

exports.updateLineUp = async function(oLineUp){
  oLineUp.LastUpdate = new Date();
  oLineUp.UpdateSource = "LineUp Crawler";

  return await AbstractMapper.update(oLineUp, dateFields);
};

exports.mapDBAnswerToClassObject = function(answer){
  var lineUp = new LineUp();

  Object.keys(answer).forEach((key) => {
    if(dateFields.includes(key)){
      lineUp[key] = moment(answer[key]);
    }else{
      lineUp[key] = answer[key];
    }
  });

  return lineUp;
};
