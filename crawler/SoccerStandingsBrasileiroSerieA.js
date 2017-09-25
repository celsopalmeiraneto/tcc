const puppeteer = require('puppeteer');
const SoccerStandings = require('./model/SoccerStandings.js');
const SoccerStandingsItem = require('./model/SoccerStandingsItem.js');
const MapperBrasileiroSerieA = require("./MapperBrasileiroSerieA.js");


class SoccerStandingsBrasileiroSerieA {
  constructor() {
  }

  read(){
    const readings = this.readStandings();
    readings.then((readings) => {
      var standingsItems = readings.map((currVal) => {
        let ssi = new SoccerStandingsItem();
        ssi.played = currVal[4];
        ssi.wins   = currVal[5];
        ssi.draws        = currVal[6];
        ssi.losses       = currVal[7];
        ssi.goalsFor     = currVal[8];
        ssi.goalsAgainst = currVal[9];
        ssi.points       = currVal[3];
        ssi.teamID       = MapperBrasileiroSerieA.teamMapper(currVal[2]);
        return ssi;
      });

      let standings = new SoccerStandings();
      standings.standings = standingsItems;
      standings.championshipID = "champCampeonatoBRSerieA2017";

      console.log(standings);

      return standings;
    })
    .catch(e => {
      console.log(e);
    });
  }

  /* jshint ignore:start */
  async readStandings(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://www.cbf.com.br/competicoes/brasileiro-serie-a/classificacao/2017');

    const colocacoes = await page.evaluate(() => {
      const table = Array.from(document.querySelectorAll(".table-standings tr"));
      return table.map(linha => {
        return Array.from(linha.cells).map(coluna => {
          return coluna.innerText;
        });
      });
    });
    return colocacoes.slice(1, colocacoes.length-1);
  };
  /* jshint ignore:end */

}





module.exports = SoccerStandingsBrasileiroSerieA;
