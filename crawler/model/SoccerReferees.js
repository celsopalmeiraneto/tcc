"use strict";

const crc32 = require("crc32");

class SoccerReferees{
  constructor(){
    this._id = null;
    this.type = "SoccerReferees";

    this.MatchId = null;

    this.RefereeId = null;
    this.AssistantRefereesIds = [];
    this.FourthOfficialId = null;
    this.AdditionalAssistants = [];

    this.LastUpdate = null;
    this.UpdateSource = null;
  }

  get crc32(){
    return this.getCRC32();
  }

  getCRC32(){
    return crc32(""+this.RefereeId
      +this.AssistantRefereesIds.join("")
      +this.FourthOfficialId
      +this.AdditionalAssistants.join("")
    );
  }


}

module.exports = SoccerReferees;
