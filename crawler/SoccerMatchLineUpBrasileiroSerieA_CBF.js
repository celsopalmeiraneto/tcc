"use strict";
const puppeteer = require("puppeteer");
const Person        = require("./model/Person.js");
const PersonMapper  = require("./model/PersonMapper.js");
const LineUp        = require("./model/LineUp.js");
const LineUpMapper  = require("./model/LineUpMapper.js");
const MapperBrasileiroSerieA = require("./MapperBrasileiroSerieA.js");


class SoccerMatchLineUpBrasileiroSerieA_CBF {
  constructor(match, teamId) {
    this.Match = match;
    this.TeamId  = teamId;
  }

  async read(){
    console.log(`LineUp - Match: ${this.Match}, Team: ${this.TeamId}`);
    let lineUpList = await this.readLineupFromWebSite();
    let oLineUp = await this.prepareLineUpObject(lineUpList);
    return await this.insertOrUpdateLineUp(oLineUp);
  }

  async prepareLineUpObject(lineUpList){
    var lineUp = new LineUp();
    lineUp.MatchId  = this.Match._id;
    lineUp.TeamId   = this.TeamId;
    lineUp._id      = `lineUp${lineUp.TeamId}${lineUp.MatchId}${this.Match.StartDateTime.toISOString()}`;
    for (var person of lineUpList) {
      let foundPerson = await PersonMapper.getPersonByFullName(person.name);
      if(!foundPerson){
        foundPerson = new Person();
        foundPerson.Fullname = person.name;
        foundPerson.Nickname = person.nickname;
        foundPerson = await PersonMapper.insertPerson(foundPerson);
      }
      lineUp.LineUpComposition.push({
        PersonId : foundPerson._id,
        ShirtNumber : person.shirtNumber,
        Starter : person.starter
      });
    }
    return lineUp;
  }

  async insertOrUpdateLineUp(oLineUp){
    let oRes = await LineUpMapper.getLineUpById(oLineUp._id);

    if(!oRes){
      return await LineUpMapper.insertLineUp(oLineUp);
    }else{
      if(oRes.crc32 != oLineUp.crc32)
        return await LineUpMapper.updateLineUp(oLineUp);
    }

    return oLineUp;
  }

  async readLineupFromWebSite(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var lineUp = null;

    try {
      const url = "http://www.cbf.com.br/api/lineup?cam=42&cat=1&jog="+this.Match.SeasonMatchNumber+"&ano=2017&clube="+MapperBrasileiroSerieA.ourIdtoCBFId(this.TeamId);

      await page.goto(url);

      lineUp = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".dados tr:not(.tabhead)"))
          .reduce((acc, tableLine) => {
            tableLine = Array.from(tableLine.children);
            acc = acc.concat({
              shirtNumber : tableLine[0].innerText,
              nickname : tableLine[1].innerText,
              name : tableLine[2].innerText,
              starter : true
            });

            if(tableLine[4].innerText != ""){
              acc = acc.concat({
                shirtNumber : tableLine[3].innerText,
                nickname : tableLine[4].innerText,
                name : tableLine[5].innerText,
                starter : false
              });
            }
            return acc;
          }, []);
      });
    } catch (e) {
      throw e;
    } finally {
      await page.close();
      await browser.close();
    }

    return lineUp;
  }


}

module.exports = SoccerMatchLineUpBrasileiroSerieA_CBF;
