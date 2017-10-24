"use strict";
const puppeteer = require("puppeteer");

const SoccerMatchCBFMapper = require("./model/SoccerMatchCBFMapper.js");
const ParallelOrchestrator = require("./model/ParallelOrchestrator.js");
const MapperBrasileiroSerieA = require("./MapperBrasileiroSerieA.js");

class SoccerNews_GloboEsporte{
  constructor(){
  }

  async readByRounds(rounds){
    let aRounds  = await Promise.all(rounds.map((round) => this.readGamesAndLinks(round)));
    let aMatches = await this.getMatchesAndUrls(aRounds);
    let aMatchesAndSummaries = await this.readMatchesSummaries(aMatches);
    
    return aMatchesAndSummaries;
  }

  async getMatchesAndUrls(aRounds){
    return await Promise.all(this.flattenArray(aRounds).map(async (v)=>{
      let res = await this.findCorrespondingMatch(v);
      if(!res)
        throw v;
      res.url = v.url;
      return res;
    }));
  }

  async findCorrespondingMatch(geObj){
    geObj.homeTeam = MapperBrasileiroSerieA.globoEsporteAcronymToOur(geObj.homeTeam);
    geObj.awayTeam = MapperBrasileiroSerieA.globoEsporteAcronymToOur(geObj.awayTeam);
    return await SoccerMatchCBFMapper.getMatchByTeamsAndRound(geObj.homeTeam, geObj.awayTeam, `Rodada ${geObj.round}`);
  }

  flattenArray(arrayOfArrays){
    return arrayOfArrays.reduce((acc, v)=>{
      acc = acc.concat(v);
      return acc;
    }, []);
  }

  async readMatchesSummaries(matches){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var res = [];

    for (var match of matches) {
      try {
        await page.goto(match.url);
        res.push(page.evaluate((match)=>{
          let summary = document.querySelector(".pos-lance-a-lance .descricao-lance p");
          if(!summary)
            throw new Error("Summary not found");

          match.summary = summary.innerText;

          let img = document.querySelector(".pos-lance-a-lance img.thumb-midia");
          if(img){
            match.img = {
              title : img.title,
              src : img.src
            };
          }
          return match;
        }, match));
      } catch (e) {
        throw "Erro: "+JSON.stringify(e);
      }
    }
    await page.close();
    await browser.close();

    return res;
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
