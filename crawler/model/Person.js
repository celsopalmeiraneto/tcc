"use strict";

const crc32 = require("crc32");

class Person {
  constructor() {
    this._id = null;
    this.type = "Person";

    this.Fullname = "";
    this.Nickname = "";

    this.DateOfBirth = null;

    this.LastUpdate = null;
    this.UpdateSource = null;
  }

  get crc32(){
    return crc32(""+this.Name+this.Nickname+this.DateOfBirth);
  }
}

module.exports = Person;
