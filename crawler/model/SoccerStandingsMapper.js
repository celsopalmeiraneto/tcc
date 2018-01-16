"use strict";
const SoccerStandings = require("./SoccerStandings.js");
const Mapper = require("./Mapper.js");

class SoccerStandingsMapper extends Mapper{
  constructor() {
    super(SoccerStandings);
    this.dateFields = ["LastUpdate", "AsOf"];
  }
}

module.exports = SoccerStandingsMapper;
