"use strict";
const SoccerMatchesBrasileiroSerieA_CBF = require("./SoccerMatchesBrasileiroSerieA_CBF");
const SoccerNews_GloboEsporte = require("./SoccerNews_GloboEsporteRodadas.js");
const IBGECities = require("./IBGECities.js");




// let brSerieAMatches = new SoccerMatchesBrasileiroSerieA_CBF();
// brSerieAMatches.read()
//   .catch((e) => {
//     console.log("Error: "+e);
//   });
//

let brNews = new SoccerNews_GloboEsporte();
brNews.readByRounds([1,2,3,4,5,6,7,8,9,10])
  .then((v) => {
    var t = v.reduce((acc, v) => {
      acc = acc.concat(v);
      return acc;
    }, [])
      .reduce((acc, v) => {
        if(!acc.includes(v.homeTeam))
          acc.push(v.homeTeam);

        if(!acc.includes(v.awayTeam))
          acc.push(v.awayTeam);

        return acc;
      }, []);

    console.log(t.sort());

  })
  .catch((e) => {
    console.log(e);
  })
