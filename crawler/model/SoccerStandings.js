"use strict";

const crc32 = require("crc32");

class SoccerStandings {
  constructor() {
    this._id = null;
    this.type = "SoccerStandings";

    this.Standings = [];
    this.AsOf = null;

    this.ChampionshipID = null;

    this.LastUpdate = null;
    this.UpdateSource = null;

  }

  get crc32(){
    return crc32(JSON.stringify(this.Standings));
  }
}

module.exports = SoccerStandings;
