"use strict";
class MapperBrasileiroSerieA {
  constructor() {
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
    case "Grêmio":
      return "teamGremio";
    case "Corinthians":
      return "teamCorinthians";
    case "Santos":
      return "teamSantos";
    case "Palmeiras":
      return "teamPalmeiras";
    case "Flamengo":
      return "teamFlamengo";
    case "Cruzeiro":
      return "teamCruzeiro";
    case "Botafogo":
      return "teamBotafogo";
    case "Atlético-PR":
      return "teamAtleticoPR";
    case "Atlético-MG":
      return "teamAtleticoMG";
    case "Fluminense":
      return "teamFluminense";
    case "Sport":
      return "teamSport";
    case "Vasco":
      return "teamVasco";
    case "Ponte Preta":
      return "teamPontePreta";
    case "Bahia":
      return "teamBahia";
    case "Coritiba":
      return "teamCoritiba";
    case "Vitória":
      return "teamVitoria";
    case "Chapecoense":
      return "teamChapecoense";
    case "Avaí":
      return "teamAvai";
    case "Atlético-GO":
      return "teamAtleticoGO";
    case "São Paulo":
      return "teamSaoPaulo";
    }
  }
}

module.exports = MapperBrasileiroSerieA;
