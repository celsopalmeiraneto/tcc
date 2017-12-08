const couchSettings = {
  ip : "192.168.15.225",
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

  async getMatches(){
    try{
      let teams    = await this.getTeamNames();
      let response = await fetch(this.formatDatabaseString()+"_design/MatchesDocs/_view/matchesByDate?include_docs=true&limit=10", {
        method : "GET"
      });
      let responseJson = await response.json();
      return responseJson.rows.map((v) => {
        v = v.doc;
        v.homeTeamName = teams.find(t => t.id == v.HomeTeamId);
        v.homeTeamName = v.homeTeamName ? v.homeTeamName.key : "";
        v.awayTeamName = teams.find(t => t.id == v.AwayTeamId);
        v.awayTeamName = v.awayTeamName ? v.awayTeamName.key : "";
        return v;
      });
    }catch(e){
      console.log(e);
    }
  }

  formatDatabaseString(){
    return `http://${couchSettings.user}:${couchSettings.pwd}@${couchSettings.ip}:${couchSettings.port}/${couchSettings.database}/`;
  }
}
