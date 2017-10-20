"use strict";
const puppeteer               = require("puppeteer");
const SoccerMatchCBF          = require("./model/SoccerMatchCBF.js");
const MapperBrasileiroSerieA  = require("./MapperBrasileiroSerieA.js");
const SoccerMatchCBFMapper    = require("./model/SoccerMatchCBFMapper.js");
const SoccerMatchLineUpBrasileiroSerieA_CBF = require("./SoccerMatchLineUpBrasileiroSerieA_CBF.js");

const moment                  = require("moment");

const Venue                   = require("./model/Venue.js");

const VenueMapper = require("./model/VenueMapper.js");

const util = require("./util.js");

class SoccerMatchesBrasileiroSerieA_CBF {
  constructor() {

  }

  async read(){
    let matchesList = await this.readMatchesFromWebSite();
    for (var match of matchesList) {
      console.log("forEach" + moment().valueOf());
      try{
        let oSoccerMatch = await this.convertCrawlerToClass(match);
        let matchOnDB = await SoccerMatchCBFMapper.getMatchById(oSoccerMatch._id);

        if(matchOnDB){
          if(matchOnDB.crc32 != oSoccerMatch.crc32){
            oSoccerMatch = await SoccerMatchCBFMapper.updateMatch(oSoccerMatch);
            console.log("Match Updated" + moment().valueOf());

          }
        }else{
          oSoccerMatch = await SoccerMatchCBFMapper.insertMatch(oSoccerMatch);
          console.log("Match Inserted" + moment().valueOf());
        }

        await (new SoccerMatchLineUpBrasileiroSerieA_CBF(oSoccerMatch, oSoccerMatch.HomeTeamId)).read();
        await (new SoccerMatchLineUpBrasileiroSerieA_CBF(oSoccerMatch, oSoccerMatch.AwayTeamId)).read();

      }catch(e){
        console.log(e);
      }
    }
  }

  async convertCrawlerToClass(singleObject){
    var soccerMatch = new SoccerMatchCBF();

    soccerMatch._id = `matchSoccerBRM2017${singleObject.gameCode.toString().padStart(4, "0")}`;
    soccerMatch.HomeTeamId = MapperBrasileiroSerieA.teamMapper(singleObject.homeTeam);
    soccerMatch.AwayTeamId = MapperBrasileiroSerieA.teamMapper(singleObject.awayTeam);

    soccerMatch.StartDateTime  = util.convertDateTimeCBFtoMomentDate(singleObject.date, singleObject.time);
    soccerMatch.VenueId = await this.getVenueId(singleObject.gameLocation);

    soccerMatch.HomeTeamScore = singleObject.homeScore;
    soccerMatch.AwayTeamScore = singleObject.awayScore;

    soccerMatch.ChampionshipId = MapperBrasileiroSerieA.getChampionshipId();

    soccerMatch.SeasonMatchNumber = singleObject.gameCode;
    soccerMatch.Round = singleObject.roundName;

    return soccerMatch;
  }

  async getVenueId(venueString){
    var venue, city, state;
    [venue = null, city = null, state = null] = venueString.split(" - ");

    if(venue == null || city == null || state == null)
      throw new Error("Venue string is missing venue, city, or state.");

    let oVenue = await VenueMapper.findVenueByNameAndCity(venue.trim(), city.trim());

    if(!oVenue){
      oVenue = new Venue();
      oVenue.Name = venue.trim();
      oVenue.City = city.trim();
      oVenue.State = state.trim();
      oVenue.Country = "Brasil";
      oVenue.UpdateSource = "Soccer Match Crawler";

      oVenue = await VenueMapper.insertVenue(oVenue);
    }

    return oVenue.id;
  }



  async readMatchesFromWebSite(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("http://www.cbf.com.br/competicoes/brasileiro-serie-a/tabela/2017");

    page.on("console", (...args) => {
      console.log("PAGE CONSOLE: ", ...args);
    });

    const roundsAndResults = await page.evaluate(() => {

      function readGameInfo(roundName, date, line){
        let gameScore = line.querySelector(".game-score")
          .innerText
          .trim()
          .split("X")
          .map(a => a.trim());

        let gameLocation = line.querySelector(".full-game-location")
          .innerText
          .trim()
          .split("\t");

        let gameCode = Number.parseInt(gameLocation.shift().split(" ").pop());

        gameLocation = gameLocation.pop();

        return {
          roundName: roundName,
          date : date,
          time : line.querySelector(".full-game-time").innerText.trim(),
          homeTeam : line.querySelector(".game-team-1").innerText.trim(),
          awayTeam : line.querySelector(".game-team-2").innerText.trim(),
          homeScore : Number.parseInt(gameScore[0]),
          awayScore : Number.parseInt(gameScore[1]),
          gameLocation : gameLocation.trim(),
          gameCode : gameCode
        };
      }

      let rounds = Array.from(document.querySelectorAll(".item,.tabela-jogos"));
      let groupByRounds = rounds.map((round) => {
        var roundName = null;
        var date = null;
        return Array.from(round.children).reduce((acc, roundLine) => {

          if(roundLine.nodeName == "H3")
            roundName = roundLine.innerText;

          if(roundLine.classList.contains("headline"))
            date = roundLine.innerText.trim();

          if(roundLine.classList.contains("row"))
            acc.push(readGameInfo(roundName, date, roundLine));

          return acc;
        }, []);
      });
      return groupByRounds.reduce((acc, v) => {
        acc = acc.concat(v);
        return acc;
      }, []);
    });

    await page.close();
    await browser.close();

    return roundsAndResults;
  }

}

module.exports = SoccerMatchesBrasileiroSerieA_CBF;
