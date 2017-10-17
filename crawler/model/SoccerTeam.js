"use strict";

class SoccerTeam {
  constructor() {
    this.id = null;
    this.Name = "";
    this.FullName = "";
    this.Nicknames = [];
    this.DateOfEstablishment = null;
    this.Headquarters = "";
    this.Sponsors = [];
    this.Players  = [];
    this.Rivalries = [];
  }
}

module.exports = SoccerTeam;
