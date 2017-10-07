"use strict";
const SoccerStandingsBrasileiroSerieA = require("./SoccerStandingsBrasileiroSerieA");
const SoccerMatchesBrasileiroSerieA_CBF = require("./SoccerMatchesBrasileiroSerieA_CBF");
const SoccerMatchLineUpBrasileiroSerieA_CBF = require("./SoccerMatchLineUpBrasileiroSerieA_CBF");
const SoccerRefereesBrasileiroSerieA_CBF = require("./SoccerRefereesBrasileiroSerieA_CBF");


let brSerieAMatches = new SoccerRefereesBrasileiroSerieA_CBF();
brSerieAMatches.read()
.then((val) => {
  console.log("Res: " +JSON.stringify(val));
})
.catch((e) => {
  console.log("Error: "+e);
});



// let brSerieAMatches = new SoccerMatchesBrasileiroSerieA_CBF();
// brSerieAMatches.read()
// .then((val) => {
//   console.log("Res: " +JSON.stringify(val));
// })
// .catch((e) => {
//   console.log("Error: "+e);
// });

//
// let lineUp = new SoccerMatchLineUpBrasileiroSerieA_CBF(207, 20013);
// lineUp.read()
// .then((val) => {
//   console.log("Res: " +JSON.stringify(val));
// })
// .catch((e) => {
//   console.log("Error: "+e);
// });
