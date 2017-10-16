"use strict";

const brazil_cities = require("./brazil_cities.json");
const brazil_states = require("./brazil_states.json");

exports.getStateIdByAcronym = function(acronym){
  return brazil_states.filter((it) => it.sigla == acronym);
};

exports.getCityByStateAcronymAndCity = function (state, city) {
  const oState = exports.getStateIdByAcronym(state);

  if(!oState)
    return null;

  return brazil_cities.filter((c) => c.UF.id == oState.id && c.nome == city);
};
