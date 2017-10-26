"use strict";
const moment = require("moment");

const AbstractMapper = require("./AbstractMapper.js");
const News      = require("./News.js");

const dateFields = ["LastUpdate", "DateOfBirth"];

exports.getById = async function (id) {
  return await AbstractMapper.getById(id, exports.mapDBAnswerToClassObject);
};


exports.updateNews = async function(oNews){
  oNews.LastUpdate = new Date();
  oNews.UpdateSource  = "News Crawler";

  return await AbstractMapper.update(oNews, dateFields);
};

exports.insertNews = async function(oNews){
  oNews.LastUpdate = new Date();
  oNews.UpdateSource  = "News Crawler";

  return await AbstractMapper.insert(oNews, dateFields);
};

exports.mapDBAnswerToClassObject = function(answer){
  var news = new News();

  Object.keys(answer).forEach((key) => {
    if(dateFields.includes(key)){
      news[key] = moment(answer[key]);
    }else{
      news[key] = answer[key];
    }
  });

  return news;
};
