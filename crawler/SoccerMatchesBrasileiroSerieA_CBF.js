"use strict";
const puppeteer = require("puppeteer");
const SoccerMatchCBF = require("./Model/SoccerMatchCBF.js");
const MapperBrasileiroSerieA  = require("./MapperBrasileiroSerieA.js");
const moment = require("moment");

class SoccerMatchesBrasileiroSerieA_CBF {
  constructor() {

  }

  read(){
    return new Promise((resolve, reject) => {
      this.readMatchesFromWebSite()
        .then((value) => {
          return resolve(value);
        })
        .catch((e)=> {
          return reject(e);
        });
    });
  }

  convertCrawlerToClass(singleObject){
    var soccerMatch = new SoccerMatchCBF();
    soccerMatch.HomeTeamId = MapperBrasileiroSerieA.teamMapper(singleObject.homeTeam);
    soccerMatch.AwayTeamId = MapperBrasileiroSerieA.teamMapper(singleObject.awayTeam);

    let startDateTime = soccerMatch.date.split(",").pop().trim()+", "+soccerMatch.time;

    soccerMatch.StartDateTime  = moment(startDateTime, "DD MMMM");
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
          gameLocation : gameLocation,
          gameCode : gameCode
        };
      }

      let rounds = Array.from(document.querySelectorAll(".item,.tabela-jogos"));
      return rounds.map((round) => {
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
    });

    await page.close();
    await browser.close();

    return roundsAndResults;
  }

}

module.exports = SoccerMatchesBrasileiroSerieA_CBF;
