"use strict";
const puppeteer = require("puppeteer");

const SoccerMatchCBFMapper = require("./model/SoccerMatchCBFMapper.js");

class SoccerNews_GloboEsporte{
  constructor(){
  }

  async readByRounds(rounds){
    try {
      var res = await Promise.all(rounds.map((round) => this.readGamesAndLinks(round)));

    } catch (e) {
      console.log(e);
    }
    return res;
  }

  async findCorrespondingMatch(geObj){
    return await SoccerMatchCBFMapper.getMatchByTeamsAndRound(geObj.homeTeam, geObj.awayTeam, `Rodada ${geObj.round}`);
  }

  async readGamesAndLinks(round){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    if(typeof round !== "number")
      throw new Error("Parameter 'round' must be a number");

    try{
      await page.goto("http://globoesporte.globo.com/servico/esportes_campeonato/responsivo/widget-uuid/1fa965ca-e21b-4bca-ac5c-bbc9741f2c3d/fases/fase-unica-seriea-2017/rodada/"+round+"/jogos.html");

      return await page.evaluate((round)=>{
        return Array.from(document.querySelectorAll(".lista-de-jogos-item")).map((match) => {
          let matchData = {};

          matchData.homeTeam = match.querySelector(".placar-jogo-equipes-mandante .placar-jogo-equipes-sigla").innerText.trim();
          matchData.awayTeam = match.querySelector(".placar-jogo-equipes-visitante .placar-jogo-equipes-sigla").innerText.trim();
          matchData.url      = match.querySelector("a.placar-jogo-link.placar-jogo-link-confronto-js").href;
          matchData.round    = round;

          return matchData;
        });
      }, round);
    }catch(e){
      throw e;
    }finally{
      await page.close();
      await browser.close();
    }
  }


}

module.exports = SoccerNews_GloboEsporte;
