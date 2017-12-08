"use strict";
const SoccerMatchesBrasileiroSerieA_CBF = require("./SoccerMatchesBrasileiroSerieA_CBF");
const SoccerNews_GloboEsporte = require("./SoccerNews_GloboEsporteRodadas.js");
const IBGECities = require("./IBGECities.js");

// let brSerieAMatches = new SoccerMatchesBrasileiroSerieA_CBF();
// brSerieAMatches.read()
//   .catch((e) => {
//     console.log("Error: "+e);
//   });

let brNews = new SoccerNews_GloboEsporte();

let ar = new Array(10);
ar = ar.fill(null).map((v,i)=>i+1);

brNews.readByRounds(ar)
  .then((v) => {
    //console.log(v);
  })
  .catch((e) => {
    console.log(e);
  })
