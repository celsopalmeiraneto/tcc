"use strict";
class SoccerStandingsItem {
  constructor() {
    this.played       = 0;
    this.wins         = 0;
    this.draws        = 0;
    this.losses       = 0;
    this.goalsFor     = 0;
    this.goalsAgainst = 0;
    this.points       = 0;

    this.teamID = null;
  }

  get goalsDifference(){
    return this.goalsFor - this.goalsAgainst;
  }
}

module.exports = SoccerStandingsItem;
