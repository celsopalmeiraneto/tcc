"use strict";
const puppeteer = require("puppeteer");

class SoccerRefereesBrasileiroSerieA_CBF {
  constructor() {

  }

  read(){
    return new Promise((resolve, reject) => {
      this.readRefereesFromWebSite()
        .then((value) => {
          return resolve(value);
        })
        .catch((e)=> {
          return reject(e);
        });
    });
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
              acc.referee = person;
              return acc;
            }

            if(position.includes("Árbitro Assistente Adicional")){
              acc.additionalAssistants.push(person);
              return acc;
            }

            if(position.includes("Árbitro Assistente")){
              acc.assistantReferee.push(person);
              return acc;
            }

            if(position == "Quarto Árbitro"){
              acc.fourthOfficial = person;
              return acc;
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
