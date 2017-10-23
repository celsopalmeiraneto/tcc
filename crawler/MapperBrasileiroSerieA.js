"use strict";
class MapperBrasileiroSerieA {
  constructor() {
  }

  static getChampionshipId(){
    return "champCampeonatoBRSerieA2017";
  }

  static globoEsporteAcronymToOur(ge){
    switch (ge.toUpperCase()) {
    case "ACG":
      return "teamAtleticoGO";
    case "AVA":
      return "teamAvai";
    case "BAH":
      return "teamBahia";
    case "BOT":
      return "teamBotafogo";
    case "CAM":
      return "teamAtleticoMG";
    case "CAP":
      return "teamAtleticoPR";
    case "CFC":
      return "teamCoritiba";
    case "CHA":
      return "teamChapecoense";
    case "COR":
      return "teamCorinthians";
    case "CRU":
      return "teamCruzeiro";
    case "FLA":
      return "teamFlamengo";
    case "FLU":
      return "teamFluminense";
    case "GRE":
      return "teamGremio";
    case "PAL":
      return "teamPalmeiras";
    case "PON":
      return "teamPontePreta";
    case "SAN":
      return "teamSantos";
    case "SAO":
      return "teamSaoPaulo";
    case "SPO":
      return "teamSport";
    case "VAS":
      return "teamVasco";
    case "VIT":
      return "teamVitoria";
    }
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
    switch (cbfID.toUpperCase()) {
    case "GRÊMIO - RS":
      return "teamGremio";
    case "CORINTHIANS - SP":
      return "teamCorinthians";
    case "SANTOS - SP":
      return "teamSantos";
    case "PALMEIRAS - SP":
      return "teamPalmeiras";
    case "FLAMENGO - RJ":
      return "teamFlamengo";
    case "CRUZEIRO - MG":
      return "teamCruzeiro";
    case "BOTAFOGO - RJ":
      return "teamBotafogo";
    case "ATLÉTICO - PR":
      return "teamAtleticoPR";
    case "ATLÉTICO - MG":
      return "teamAtleticoMG";
    case "FLUMINENSE - RJ":
      return "teamFluminense";
    case "SPORT - PE":
      return "teamSport";
    case "VASCO - RJ":
      return "teamVasco";
    case "VASCO DA GAMA - RJ":
      return "teamVasco";
    case "PONTE PRETA - SP":
      return "teamPontePreta";
    case "BAHIA - BA":
      return "teamBahia";
    case "CORITIBA - PR":
      return "teamCoritiba";
    case "VITÓRIA - BA":
      return "teamVitoria";
    case "CHAPECOENSE - SC":
      return "teamChapecoense";
    case "AVAÍ - SC":
      return "teamAvai";
    case "ATLÉTICO - GO":
      return "teamAtleticoGO";
    case "SÃO PAULO - SP":
      return "teamSaoPaulo";
    }
  }
}

module.exports = MapperBrasileiroSerieA;
