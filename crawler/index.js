"use strict";
const minimist = require("minimist");
const SoccerMatchesBrasileiroSerieA_CBF = require("./SoccerMatchesBrasileiroSerieA_CBF");
const SoccerNews_GloboEsporte = require("./SoccerNews_GloboEsporteRodadas.js");
const SoccerRefereesBrasileiroSerieA_CBF = require("./SoccerRefereesBrasileiroSerieA_CBF.js");
const SoccerStandingsBrasileiroSerieA = require("./SoccerStandingsBrasileiroSerieA.js");

var args = minimist(process.argv.slice(2));

(async (args)=>{
  // --matches==true
  if(args.matches && args.matches.toLowerCase() == "true"){
    let brSerieAMatches = new SoccerMatchesBrasileiroSerieA_CBF();
    try {
      console.log(await brSerieAMatches.read());
    } catch (e) {
      console.log(e);
    }
  }

  // --referees==true
  if(args.referees && args.referees.toLowerCase() == "true"){
    let referees = new SoccerRefereesBrasileiroSerieA_CBF();
    try {
      var res = await referees.read();
      console.log(JSON.stringify(res));
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

  // --standings==true
  if(args.standings && args.standings.toLowerCase() == "true"){
    let standings = new SoccerStandingsBrasileiroSerieA();
    let res = await standings.read();
    console.log(res);
  }

})(args);

//--matches=true
