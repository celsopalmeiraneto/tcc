"use strict";

const moment = require("moment");


exports.convertDateTimeCBFtoMomentDate = function(dateString, timeString){
  let date = dateString.split(",")
    .pop().trim().split(" de ")
    .map(a => a.trim())
    .join(" ");

  let dateTime = moment(`${date} ${timeString}`, "DD MMMM YYYY HH:mm", "pt-br");

  return dateTime.isValid() ? dateTime : null;
};

exports.removeSpacesFromStrings = function(string){
  if(typeof string != "string")
    throw new Error("Argument string must be a string.");
  return string.split(/[\s\uFEFF\xA0]/).reduce((acc, v) => {
    acc = (v.trim() == "" ? acc : acc+v);
    return acc;
  });
};
