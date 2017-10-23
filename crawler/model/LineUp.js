"use strict";

const crc32 = require("crc32");

class LineUp {
  constructor() {
    this._id = null;
    this.type = "LineUp";

    this.MatchId = null;
    this.TeamId  = null;

    this.LineUpComposition  = [];

    this.LastUpdate = null;
    this.UpdateSource = null;
  }

  get crc32(){
    let lineupString = this.LineUpComposition.reduce((acc, v)=>{
      acc += (v.hasOwnProperty("PersonId") ? v.PersonId : "");
      acc += (v.hasOwnProperty("ShirtNumber") ? v.ShirtNumber : "");
      acc += (v.hasOwnProperty("Starter") ? v.Starter : "");
      return acc;
    }, "");
    return crc32(lineupString);
  }

  toString(){
    return `LineUp ${this.id}, MatchId: ${this.MatchId}, TeamId: ${this.TeamId}`;
  }

}


module.exports = LineUp;
