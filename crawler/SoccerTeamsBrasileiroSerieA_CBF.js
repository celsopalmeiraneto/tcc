const puppeteer = require('puppeteer');
const SoccerStandings = require('./model/SoccerTeam.js');

class SoccerTeamBrasileiroSerieA_CBF{
  constructor() {
  }


  async readStandings(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('http://www.cbf.com.br/competicoes/brasileiro-serie-a/equipes/2017');
    const teamsLinks = await page.evaluate(() => {
      return Array.from(document.getElementsByClassName("cell")[0].children)
      .map(val => val.href);
    });

    teamsLinks.forEach((team, idx, array) => {
      await page.goto(team);
      
    });


    const colocacoes = await page.evaluate(() => {
      const table = Array.from(document.querySelectorAll(".table-standings tr"));
      return table.reduce((accumulator, currVal)=>{
        return accumulator.push(Array.from(currVal.children).reduce((accumulator, currVal) =>{
          return accumulator.push(currVal.innerText);
        } ,[]));
      }, []);
    });
    return colocacoes.split('|');
  };
  /* jshint ignore:end */


}

}
