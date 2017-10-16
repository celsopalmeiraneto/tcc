"use strict";
class MapperBrasileiroSerieA {
  constructor() {
  }

  static getChampionshipId(){
    return "champCampeonatoBRSerieA2017";
  }

  static ourIdtoCBFId(id){
    switch (id) {
    case "teamAtleticoGO":
      return 20093;
    case "teamAtleticoMG":
      return 20003;
    case "teamAtleticoPR":
      return 20052;
    case "teamAvai":
      return 20058;
    case "teamBahia":
      return 20006;
    case "teamBotafogo":
      return 20004;
    case "teamChapecoense":
      return 20086;
    case "teamCorinthians":
      return 20001;
    case "teamCoritiba":
      return 20025;
    case "teamCruzeiro":
      return 20021;
    case "teamFlamengo":
      return 20016;
    case "teamFluminense":
      return 20014;
    case "teamGremio":
      return 20013;
    case "teamPalmeiras":
      return 20002;
    case "teamPontePreta":
      return 20037;
    case "teamSantos":
      return 20008;
    case "teamSport":
      return 20010;
    case "teamSaoPaulo":
      return 20005;
    case "teamVasco":
      return 20012;
    case "teamVitoria":
      return 20018;
    }
  }


  static teamMapper(cbfID){
    switch (cbfID) {
    case "Grêmio - RS":
      return "teamGremio";
    case "Corinthians - SP":
      return "teamCorinthians";
    case "Santos - SP":
      return "teamSantos";
    case "Palmeiras - SP":
      return "teamPalmeiras";
    case "Flamengo - RJ":
      return "teamFlamengo";
    case "Cruzeiro - MG":
      return "teamCruzeiro";
    case "Botafogo - RJ":
      return "teamBotafogo";
    case "Atlético - PR":
      return "teamAtleticoPR";
    case "Atlético - MG":
      return "teamAtleticoMG";
    case "Fluminense - RJ":
      return "teamFluminense";
    case "Sport - PE":
      return "teamSport";
    case "Vasco - RJ":
      return "teamVasco";
    case "Ponte Preta - SP":
      return "teamPontePreta";
    case "Bahia - BA":
      return "teamBahia";
    case "Coritiba - PR":
      return "teamCoritiba";
    case "Vitória - BA":
      return "teamVitoria";
    case "Chapecoense - SC":
      return "teamChapecoense";
    case "Avaí - SC":
      return "teamAvai";
    case "Atlético - GO":
      return "teamAtleticoGO";
    case "São Paulo - SP":
      return "teamSaoPaulo";
    }
  }
}

module.exports = MapperBrasileiroSerieA;
