"use strict";
const fs = require("fs");
const puppeteer = require("puppeteer");
const request = require("request");

const MapperBrasileiroSerieA = require("./MapperBrasileiroSerieA.js");
const News = require("./model/News.js");
const NewsMapper = require("./model/NewsMapper.js");
const SoccerMatchCBFMapper = require("./model/SoccerMatchCBFMapper.js");

class SoccerNews_GloboEsporte{
  constructor(){
  }

  async readByRounds(rounds){
    for (var round of rounds) {
      console.log("Round "+round);

      console.log(round+" reading matches and links");
      let ml = await this.readMatchesAndLinks(round);

      console.log(round+" getting our matches");
      let aMatches = await this.getOurMatches(ml);

      console.log(round+" reading summaries");
      let aMatchesAndSummaries = await this.readSummaries(aMatches);

      console.log(round+" inserting on couchdb");
      let aNews = await this.insertOrUpdateNews(aMatchesAndSummaries);

      console.log(round+" downloading photos");
      await this.downloadNewsPhotos(aMatchesAndSummaries);
    }
  }

  async downloadNewsPhotos(aMatchesAndSummaries){
    for (var news of aMatchesAndSummaries){
      if(news.hasOwnProperty("img")){
        try{
          let extension = news.img.src.split(".").pop();
          if(["jpg", "png", "jpeg"].includes(extension.toLowerCase()))
            await request(news.img.src).pipe(fs.createWriteStream("./images/img"+news._id+"."));
        }catch(e){
          console.error(e);
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

    await Promise.all(aGEMatches.map(async (v)=>{
      try{
        let res = await this.findCorrespondingMatch(v);
        if(res){
          res.url = v.url;
          ourMatches.push(res);
        }
      }catch(e){
        console.error(e);
      }
    }));

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
    var res = [];

    var executionArray = [].concat(matches);

    while(executionArray.length > 0){
      let runningNow = executionArray.splice(0, 5);
      await Promise.all(runningNow.map(async (match)=>{
        console.log("reading summary... Summaries left: "+executionArray.length);
        if(!match.url)
          return null;
        try {
          const page = await browser.newPage();
          await page.goto(match.url, {
            timeout : 180000
          });
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
          await page.close();
        } catch (e) {
          console.log(e);
        }
      }));
    }
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
