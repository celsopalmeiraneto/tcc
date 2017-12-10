import { couchSettings } from "./Util";

export default class DataRepo{
  constructor() {
  }

  async addPersonsToLineUpComposition(lineUpComposition){
    return await Promise.all(lineUpComposition.map(async (v)=>{
      v.person = await this.getDocumentById(v.PersonId);
      return v;
    }));
  }

  async getTeamNames(){
    try{
      let response = await fetch(this.formatDatabaseString()+"_design/TeamDocs/_view/teamByName", {
        method : "GET"
      });
      let responseJson = await response.json();
      return responseJson.rows;
    }catch(e){
      console.log(e);
    }
  }

  async getDocumentById(_id){
    try{
      let response = await fetch(this.formatDatabaseString()+_id, {
        method : "GET"
      });
      let responseJson = await response.json();
      return responseJson;
    }catch(e){
      console.log(e);
    }
  }

  async getLineUpForMatch(matchId){
    try{
      let response = await fetch(this.formatDatabaseString()+`_design/LineUpDocs/_view/lineUpByMatchAndTeam?startkey=["${matchId}"]&endkey=["${matchId}","z"]&include_docs=true`, {
        method : "GET"
      });
      let responseJson = await response.json();
      responseJson = await Promise.all(responseJson.rows.map(async (lineUp) => {
        let doc = lineUp.doc;
        doc.LineUpComposition = await this.addPersonsToLineUpComposition(doc.LineUpComposition);
        return doc;
      }));
      return responseJson;
    }catch(e){
      console.log(e);
    }
  }

  async getMatches(){
    try{
      let teams    = await this.getTeamNames();
      let response = await fetch(this.formatDatabaseString()+"_design/MatchesDocs/_view/matchesByDate?include_docs=true&limit=50", {
        method : "GET"
      });
      let responseJson = await response.json();
      return await Promise.all(responseJson.rows.map(async (v) => {
        v = v.doc;
        v.homeTeamName = teams.find(t => t.id == v.HomeTeamId);
        v.homeTeamName = v.homeTeamName ? v.homeTeamName.key : "";
        v.awayTeamName = teams.find(t => t.id == v.AwayTeamId);
        v.awayTeamName = v.awayTeamName ? v.awayTeamName.key : "";
        v.venueName = await this.getDocumentById(v.VenueId);
        v.venueName = v.venueName.Name;
        return v;
      }));
    }catch(e){
      console.log(e);
    }
  }

  async getNewsAbout(subject){
    try{
      let response = await fetch(this.formatDatabaseString()+`_design/NewsDocs/_view/newsByAbout?key="${subject}"&include_docs=true`, {
        method : "GET"
      });
      let responseJson = await response.json();
      return responseJson.rows.map((v)=>{
        return v.doc;
      });
    }catch(e){
      console.log(e);
    }
  }


  formatDatabaseString(){
    return `http://${couchSettings.user}:${couchSettings.pwd}@${couchSettings.ip}:${couchSettings.port}/${couchSettings.database}/`;
  }
}
