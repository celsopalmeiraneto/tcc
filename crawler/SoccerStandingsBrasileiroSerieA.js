const puppeteer = require("puppeteer");
const SoccerStandings = require("./model/SoccerStandings.js");
const SoccerStandingsItem = require("./model/SoccerStandingsItem.js");
const SoccerStandingsMapper = require("./model/SoccerStandingsMapper.js");
const MapperBrasileiroSerieA = require("./MapperBrasileiroSerieA.js");


class SoccerStandingsBrasileiroSerieA {
  constructor() {
  }

  async read(){
    const readings = await this.readStandings();

    var standingsItems = readings.map((currVal) => {
      let ssi = new SoccerStandingsItem();
      ssi.Played = currVal[4];
      ssi.Wins   = currVal[5];
      ssi.Draws        = currVal[6];
      ssi.Losses       = currVal[7];
      ssi.GoalsFor     = currVal[8];
      ssi.GoalsAgainst = currVal[9];
      ssi.Points       = currVal[3];
      ssi.TeamId       = MapperBrasileiroSerieA.teamMapper(currVal[2]);
      return ssi;
    });

    let standings = new SoccerStandings();
    standings.Standings = standingsItems;
    standings.ChampionshipID = "champCampeonatoBRSerieA2017";
    standings.AsOf = new Date();
    standings.LastUpdate = new Date();
    standings.UpdateSource = "Standings Crawler";
    standings._id = `standingsAsOf${new Date().toISOString()}_${standings.ChampionshipID}`;

    let mapper = new SoccerStandingsMapper();

    await mapper.insert(standings);

    return standings;
  }

  async readStandings(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto("http://www.cbf.com.br/competicoes/brasileiro-serie-a/classificacao/2017");

    const colocacoes = await page.evaluate(() => {
      const table = Array.from(document.querySelectorAll(".table-standings tr"));
      return table.map(linha => {
        return Array.from(linha.cells).map(coluna => {
          return coluna.innerText;
        });
      });
    });

    await page.close();
    await browser.close();

    return colocacoes.slice(1, colocacoes.length-1);
  }

}

module.exports = SoccerStandingsBrasileiroSerieA;
