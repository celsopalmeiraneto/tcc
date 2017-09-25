"use strict";

const SoccerMatch = require("./SoccerMatch.js");

class SoccerMatchCBF extends SoccerMatch {
  constructor() {
    super();

    this.SeasonMatchNumber = null;
    this.Round = null;
  }
}

module.exports = SoccerMatchCBF;
