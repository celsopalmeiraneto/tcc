"use strict";

const crc32 = require("crc32");

class SoccerMatch {
  constructor() {

    this._id  = null;
    this.type = "SoccerMatch";

    this.HomeTeamId = null;
    this.AwayTeamId = null;

    this.StartDateTime = null;
    this.VenueId = null;

    this.HomeTeamScore = 0;
    this.AwayTeamScore = 0;

    this.ChampionshipId = null;

    this.LastUpdate = null;
    this.UpdateSource = null;
  }

  get crc32(){
    return this.getCRC32();
  }

  getCRC32(){
    return crc32(""+this.StartDateTime.toISOString()
    +this.VenueId
    +this.HomeTeamScore
    +this.AwayTeamScore
    +this.HomeTeamId
    +this.AwayTeamId);
  }
}

module.exports = SoccerMatch;
