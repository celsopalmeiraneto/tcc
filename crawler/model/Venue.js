"use strict";

const crc32 = require("crc32");

class Venue {
  constructor() {
    this._id  = null;
    this.type = "Venue";

    this.Name = "";

    this.City = "";
    this.State = "";
    this.Country = "";

    this.LastUpdate = null;
    this.UpdateSource = null;

  }

  get crc32(){
    return this.getCRC32();
  }

  getCRC32(){
    return crc32(JSON.stringify(this));
  }
}

module.exports = Venue;
