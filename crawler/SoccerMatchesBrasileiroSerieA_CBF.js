"use strict";
const puppeteer = require('puppeteer');

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


  async readMatchesFromWebSite(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://www.cbf.com.br/competicoes/brasileiro-serie-a/tabela/2017');

    page.on('console', (...args) => {
      console.log("PAGE CONSOLE: ", ...args);
    });

    const roundsAndResults = await page.evaluate(() => {
      let rounds = Array.from(document.querySelectorAll(".item,.tabela-jogos"));
      return rounds.map((round) => {
        var roundName = null;
        var date = null;
        return Array.from(round.children).reduce((acc, roundLine) => {
          if(roundLine.nodeName == "H3"){
            roundName = roundLine.innerText;
            return acc;
          }

          if(roundLine.classList.contains("headline")){
            date = roundLine.innerText.trim();
            return acc;
          }

          if(roundLine.classList.contains("row")){
            let gameScore = roundLine.querySelector(".game-score")
            .innerText
            .trim()
            .split("X")
            .map(a => a.trim());

            let gameLocation = roundLine.querySelector(".full-game-location")
            .innerText
            .trim()
            .split("\t");

            let gameCode = Number.parseInt(gameLocation.shift().split(" ").pop());

            gameLocation = gameLocation.pop();


            acc.push({
              roundName: roundName,
              date : date,
              time : roundLine.querySelector(".full-game-time").innerText.trim(),
              homeTeam : roundLine.querySelector(".game-team-1").innerText.trim(),
              awayTeam : roundLine.querySelector(".game-team-2").innerText.trim(),
              homeScore : Number.parseInt(gameScore[0]),
              awayScore : Number.parseInt(gameScore[1]),
              gameLocation : gameLocation,
              gameCode : gameCode
            });
            return acc;
          }
        }, []);
      });
    });
    await page.close();
    await browser.close();

    return roundsAndResults;

    function
  }


}

module.exports = SoccerMatchesBrasileiroSerieA_CBF;
