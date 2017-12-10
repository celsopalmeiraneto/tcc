const couchSettings = {
  ip : "192.168.15.250",
  port : 5984,
  user : "root",
  pwd  : "root",
  database : "tcc"
};
export default class DataRepo{
  constructor() {
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
        v.venueName = await this.getDocumentById(v.VenueId).Name;
        return v;
      }));
    }catch(e){
      console.log(e);
    }
  }

  formatDatabaseString(){
    return `http://${couchSettings.user}:${couchSettings.pwd}@${couchSettings.ip}:${couchSettings.port}/${couchSettings.database}/`;
  }
}
