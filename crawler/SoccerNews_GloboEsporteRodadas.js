"use strict";
const puppeteer = require("puppeteer");
const fs = require("fs");
const request = require("request");

const SoccerMatchCBFMapper = require("./model/SoccerMatchCBFMapper.js");
const News = require("./model/News.js");
const NewsMapper = require("./model/NewsMapper.js");
const MapperBrasileiroSerieA = require("./MapperBrasileiroSerieA.js");

class SoccerNews_GloboEsporte{
  constructor(){
  }

  async readByRounds(rounds){
    let aGEMatches = await Promise.all(rounds.map((round) => this.readMatchesAndLinks(round)));
    let aMatches = await this.getOurMatches(aGEMatches);
    let aMatchesAndSummaries = await this.readSummaries(aMatches);

    let aNews = await this.insertOrUpdateNews(aMatchesAndSummaries);
    //await this.downloadNewsPhotos(aMatchesAndSummaries);

    return aNews;
  }

  async downloadNewsPhotos(aMatchesAndSummaries){
    for (var news of aMatchesAndSummaries){
      if(news.hasOwnProperty("img")){
        request(news.img.src).pipe(fs.createWriteStream("./images/img"+Math.random().toString().replace(".","")+".png"));
      }
    }
  }

  async insertOrUpdateNews(aMatchesAndSummaries){
    let lotsOfNews = this.convertToNews(aMatchesAndSummaries);
    for (var oneNews of lotsOfNews) {
      if(!oneNews)
        continue;

      let onDBNews = await NewsMapper.getById(oneNews._id);

      if(onDBNews){
        if(onDBNews.crc32 != oneNews.crc32){
          oneNews = await NewsMapper.updateNews(oneNews);
        }
      }else{
        oneNews = await NewsMapper.insertNews(oneNews);
      }

    }
    return lotsOfNews;
  }

  convertToNews(aMatchesAndSummaries){
    return aMatchesAndSummaries.map((v)=>{
      let news = new News();
      news._id = `newsGloboEsporte${v._id}`;
      news.About.push(v._id, v.HomeTeamId, v.AwayTeamId, v.ChampionshipId);
      news.Text  = v.summary;
      news.Url   = v.url;
      return news;
    });
  }

  async getOurMatches(aGEMatches){
    return await Promise.all(this.flattenArray(aGEMatches).map(async (v)=>{
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

  async readSummaries(matches){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    var res = [];

    for (var match of matches) {
      try {
        await page.goto(match.url);
        res.push(await page.evaluate((match)=>{
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
        await page.close();
        await browser.close();
        throw "Erro: "+JSON.stringify(e);
      }
    }
    await page.close();
    await browser.close();

    return res;
  }

  async readMatchesAndLinks(round){
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
