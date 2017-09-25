"use strict";
const puppeteer = require('puppeteer');

class SoccerMatchLineUpBrasileiroSerieA_CBF {
  constructor(match, team) {
    this.match = match;
    this.team  = team;
  }

  read(){
    return new Promise((resolve, reject) => {
      this.readLineupFromWebSite()
      .then((value) => {
        return resolve(value);
      })
      .catch((e)=> {
        return reject(e);
      });
    });
  }


  async readLineupFromWebSite(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const url = 'http://www.cbf.com.br/api/lineup?cam=42&cat=1&jog='+this.match+'&ano=2017&clube='+this.team;

    await page.goto(url);

    page.on('console', (...args) => {
      console.log("PAGE CONSOLE: ", ...args);
    });

    const lineUp = await page.evaluate(() => {
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

    await page.close();
    await browser.close();

    return lineUp;
  }


}

module.exports = SoccerMatchLineUpBrasileiroSerieA_CBF;
