"use strict";
const minimist = require("minimist");
const SoccerMatchesBrasileiroSerieA_CBF = require("./SoccerMatchesBrasileiroSerieA_CBF");
const SoccerNews_GloboEsporte = require("./SoccerNews_GloboEsporteRodadas.js");
const IBGECities = require("./IBGECities.js");

var args = minimist(process.argv.slice(2));

(async (args)=>{
  // --matches==true
  if(args.matches && args.matches.toLowerCase() == "true"){
    let brSerieAMatches = new SoccerMatchesBrasileiroSerieA_CBF();
    try {
      await brSerieAMatches.read();
    } catch (e) {
      console.log(e);
    }
  }

  // --round==1 --round==2 --round==all
  if(args.round){
    let ar = [];
    if(args.round.toLowerCase() == "all"){
      ar = new Array(38).fill(null).map((v,i)=>i+1);
    }else{
      ar = args.round.map(v => Number.parseInt(v));
    }

    let brNews = new SoccerNews_GloboEsporte();
    try{
      await brNews.readByRounds(ar);
    }catch(e){
      console.log(e);
    }
  }
})(args);

//--matches=true
