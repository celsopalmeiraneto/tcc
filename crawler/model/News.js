"use strict";

const crc32 = require("crc32");

class News {
  constructor() {
    this._id = null;
    this.type = "News";

    this.About = [];
    this.Text  = null;
    this.Url   = null;

    this.LastUpdate = null;
    this.UpdateSource = null;
  }

  get crc32(){
    return crc32(this.About.join("")+this.Text+this.Url);
  }
}

module.exports = News;
