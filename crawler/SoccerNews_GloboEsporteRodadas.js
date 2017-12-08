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
    let aGEMatches = [];
    for (var round of rounds) {
      let ml = await this.readMatchesAndLinks(round);
      aGEMatches.push(ml);

      let aMatches = await this.getOurMatches(ml);
      let aMatchesAndSummaries = await this.readSummaries(aMatches);
      let aNews = await this.insertOrUpdateNews(aMatchesAndSummaries);
      await this.downloadNewsPhotos(aMatchesAndSummaries);
    }
    //return aNews;
  }

  async downloadNewsPhotos(aMatchesAndSummaries){
    for (var news of aMatchesAndSummaries){
      if(news.hasOwnProperty("img")){
        try{
          await request(news.img.src).pipe(fs.createWriteStream("./images/img"+news._id+"."+news.img.src.split(".").pop()));
        }catch(e){
          console.log(e);
        }
      }
    }
  }

  async insertOrUpdateNews(aMatchesAndSummaries){
    let lotsOfNews = [];
    for (var matchAndSummary of aMatchesAndSummaries) {
      if(!matchAndSummary)
        continue;

      var oneNews = this.convertToNews(matchAndSummary);

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
      lotsOfNews.push(oneNews);
    }
    return lotsOfNews;
  }

  convertToNews(matchAndSummary){
    let news = new News();
    news._id = `newsGloboEsporte${matchAndSummary._id}`;
    news.About.push(matchAndSummary._id, matchAndSummary.HomeTeamId, matchAndSummary.AwayTeamId, matchAndSummary.ChampionshipId);
    news.Text  = matchAndSummary.summary;
    news.Url   = matchAndSummary.url;
    return news;
  }

  async getOurMatches(aGEMatches){
    var ourMatches = [];
    for (var v of aGEMatches) {
      let res = await this.findCorrespondingMatch(v);
      if(!res)
        continue;
      res.url = v.url;
      ourMatches.push(res);
    }
    return ourMatches;
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
      if(!match.url)
        continue;
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
              src : img.src.substr(0,4) != "data" ? img.src : img.dataset.src
            };
          }
          return match;
        }, match));
      } catch (e) {
        console.log(e);
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
          matchData.url      = match.querySelector("a.placar-jogo-link.placar-jogo-link-confronto-js");
          if(matchData.url)
            matchData.url = matchData.url.href;
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
