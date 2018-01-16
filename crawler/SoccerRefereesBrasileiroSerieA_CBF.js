"use strict";
const puppeteer = require("puppeteer");

const Person = require("./model/Person.js");
const PersonMapper = require("./model/PersonMapper.js");
const SoccerMatchCBFMapper = require("./model/SoccerMatchCBFMapper.js");
const SoccerReferees = require("./model/SoccerReferees.js");
const SoccerRefereesMapper = require("./model/SoccerRefereesMapper.js");

class SoccerRefereesBrasileiroSerieA_CBF {
  constructor() {

  }

  async read(){
    var aRefereesFromWebsite = await this.readRefereesFromWebSite();
    var aReferees = await this.convertWebsiteResultsToRefereesObj(aRefereesFromWebsite);
    aReferees = await this.insertOrUpdate(aReferees);
    return aReferees;
  }

  async convertWebsiteResultsToRefereesObj(results){
    if(!results) return null;

    var ret = [];

    for (var v of results) {
      try {
        var oMatch = await SoccerMatchCBFMapper.getMatchByCBFNumber(v.gameCode);
        if(!oMatch) continue;

        var oSoccerReferees = new SoccerReferees();
        oSoccerReferees.MatchId = oMatch._id;
        oSoccerReferees.RefereeId = (await this.getPersonsIds([v.referee])).pop();
        oSoccerReferees.FourthOfficialId = (await this.getPersonsIds([v.fourthOfficial])).pop();
        oSoccerReferees.AssistantRefereesIds = await this.getPersonsIds(v.assistantReferee);
        oSoccerReferees.AdditionalAssistants = await this.getPersonsIds(v.additionalAssistants);

        oSoccerReferees._id = "referees"+oSoccerReferees.MatchId;

        ret.push(oSoccerReferees);
      } catch (e) {
        console.log(e);
      }
    }
    return ret;
  }

  async getPersonsIds(aFullnames){
    var persons = await PersonMapper.getPersonsByFullNames(aFullnames);

    persons = await Promise.all(persons.map(async (v, idx) => {
      if(!v){
        var oPerson = new Person();
        oPerson.Fullname = aFullnames[idx];
        oPerson.Nickname = null;
        return (await PersonMapper.insertPerson(oPerson))._id;
      }
      return v;
    }));
    return persons.map(v => v._id);
  }

  async insertOrUpdate(aReferees){
    return Promise.all(aReferees.map(async (v)=>{
      var oRefereesOnDB = await SoccerRefereesMapper.getSoccerRefereesById(v._id);
      if(oRefereesOnDB == null){
        return await SoccerRefereesMapper.insertSoccerReferees(v);
      }else{
        if(oRefereesOnDB.crc32 != v.crc32){
          return await SoccerRefereesMapper.updateSoccerReferees(oRefereesOnDB);
        }
      }
      return oRefereesOnDB;
    }));
  }

  async readRefereesFromWebSite(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("http://www.cbf.com.br/competicoes/brasileiro-serie-a/tabela/2017");


    const referees = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("[id^='escala']")).map((refereeTable) => {
        var gameCode = refereeTable.id.split("-").pop();
        return Array.from(refereeTable.getElementsByTagName("tbody").item(0).children)
          .reduce((acc, referee) => {
            let position = referee.firstElementChild.innerText.trim();
            let person   = referee.lastElementChild.innerText.trim();

            if(position == "Árbitro"){
              acc.referee = clearName(person);
              return acc;
            }

            if(position.includes("Árbitro Assistente Adicional")){
              acc.additionalAssistants.push(clearName(person));
              return acc;
            }

            if(position.includes("Árbitro Assistente")){
              acc.assistantReferee.push(clearName(person));
              return acc;
            }

            if(position == "Quarto Árbitro"){
              acc.fourthOfficial = clearName(person);
              return acc;
            }
            return acc;

            function clearName(dirtyName){
              dirtyName = dirtyName.split(" - ");
              dirtyName.pop();
              dirtyName = dirtyName.join();
              return dirtyName;
            }

          }, {
            gameCode : gameCode,
            referee : null,
            assistantReferee : [],
            fourthOfficial : null,
            additionalAssistants : []
          });
      });
    });

    await page.close();
    await browser.close();

    return referees;
  }

}

module.exports = SoccerRefereesBrasileiroSerieA_CBF;
