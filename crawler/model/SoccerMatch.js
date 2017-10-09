"use strict";

const crc32 = require("crc32");

class SoccerMatch {
  constructor() {

    this.id = null;

    this.HomeTeamId = null;
    this.AwayTeamId = null;

    this.StartDateTime = null;
    this.Venue = null;

    this.HomeTeamScore = 0;
    this.AwayTeamScore = 0;

    this.ChampionshipId = null;
  }

  getCRC32(){
    return crc32(JSON.stringify(this));
  }
}

module.exports = SoccerMatch;
