"use strict";

class SoccerMatch {
  constructor() {
    super();

    this.id = null;

    this.HomeTeamId = null;
    this.AwayTeamId = null;

    this.StartDateTime = null;
    this.Venue = null;

    this.HomeTeamScore = 0;
    this.AwayTeamScore = 0;

    this.ChampionshipId = null;
  }
}

module.exports = SoccerMatch;
