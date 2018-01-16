"use strict";
class SoccerStandingsItem {
  constructor() {
    this.Played       = 0;
    this.Wins         = 0;
    this.Draws        = 0;
    this.Losses       = 0;
    this.GoalsFor     = 0;
    this.GoalsAgainst = 0;
    
    this.Points       = 0;

    this.TeamId = null;
  }
}

module.exports = SoccerStandingsItem;
