import React, { Component } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Card, List, ListItem, Text } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

import DataRepo from './DataRepo';
import * as Util from './Util';



export default class MatchScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      loading : true,
      match : null,
      homeTeam : null,
      awayTeam : null,
      venue : null,
      homeLineUp : null,
      awayLineUp : null,
      news : []
    }
  }
  static navigationOptions = ({navigation}) => ({
    title : navigation.state.params.matchDesc
  });

  componentDidMount(){
    let dr = new DataRepo();
    dr.getDocumentById(this.props.navigation.state.params.matchId)
      .then((v)=>{
        this.setState({
          match : v
        });
        this.getRelatedDocuments();
      });
  }

  async getRelatedDocuments(){
    if(!this.state.match)
      return;

    let match = this.state.match;
    let dr = new DataRepo();

    let stateObj = {};
    stateObj.homeTeam = await dr.getDocumentById(match.HomeTeamId);
    stateObj.awayTeam = await dr.getDocumentById(match.AwayTeamId);
    stateObj.venue    = await dr.getDocumentById(match.VenueId);

    let lineUps = await dr.getLineUpForMatch(match._id);
    stateObj.homeLineUp = lineUps.find(v => v.TeamId == match.HomeTeamId);
    stateObj.homeLineUp.LineUpComposition.sort(sortLineUpByShirt);
    stateObj.homeLineUp.LineUpComposition.sort(sortLineUpByStarter);

    stateObj.awayLineUp = lineUps.find(v => v.TeamId == match.AwayTeamId);
    stateObj.awayLineUp.LineUpComposition.sort(sortLineUpByShirt);
    stateObj.awayLineUp.LineUpComposition.sort(sortLineUpByStarter);


    stateObj.news = await dr.getNewsAbout(match._id);
    stateObj.news = stateObj.news.concat(stateObj.news);

    stateObj.loading = false;

    this.setState(stateObj);

    function sortLineUpByShirt(a, b){
      let res = 0;
      if(a.ShirtNumber.toString().padStart(2,0) < b.ShirtNumber.toString().padStart(2,0))
        res = -1;
      if(a.ShirtNumber.toString().padStart(2,0) > b.ShirtNumber.toString().padStart(2,0))
        res = 1;
      return res;
    }
    function sortLineUpByStarter(a, b){
      let res = 0;
      if(a.Starter && !b.Starter)
        res = -1;
      if(!a.Stater && b.Stater)
        res = 1;
      return res;
    }
  }

  render(){
    const { navigate } = this.props.navigation;
    let matchImage = null;
    if(this.state.match){
      matchImage = <Image
        style = {{width : 150, height : 150}}
        source={{uri : Util.getImageUrl(this.state.match._id)}}
      />
    }

    //
    //
    let homeLineUp = null;
    if(this.state.homeLineUp){
      homeLineUp = this.state.homeLineUp.LineUpComposition.map((v, i)=>{
        return (
          <ListItem
            key = {v.PersonId}
            title = {`${v.ShirtNumber} - ${v.person.Nickname} (${v.Starter ? "T" : "R"})`}
            hideChevron = {true}
          />
        )
      })
    }


    let awayLineUp = null;
    if(this.state.awayLineUp){
      awayLineUp = this.state.awayLineUp.LineUpComposition.map((v, i)=>{
        return (
          <ListItem
            key = {v.PersonId}
            title = {`${v.ShirtNumber} - ${v.person.Nickname} (${v.Starter ? "T" : "R"})`}
            hideChevron = {true}
          />
        )
      })
    }

    return (
      <ScrollView style = {{ padding : 10 }}>
        <Spinner visible={this.state.loading} />
        <View style = {{flex : 1, flexDirection : "row"}}>
          {matchImage}
          <Text style = {styles.matchSummary}>
            <Text style={styles.matchSummaryLeftItems}>Data: </Text>{this.state.match && Util.formatDateStringToShortDateTime(this.state.match.StartDateTime)}{'\n'}
            <Text style={styles.matchSummaryLeftItems}>Local: </Text>{this.state.venue && `${this.state.venue.Name}, ${this.state.venue.City}, ${this.state.venue.State}` }{'\n'}
            <Text style={styles.matchSummaryLeftItems}>Resultado: </Text>{this.state.match ? `${this.state.match.HomeTeamScore} - ${this.state.match.AwayTeamScore}`:''}{'\n'}
            <Text style={styles.matchSummaryLeftItems}>Rodada: </Text>{this.state.match && this.state.match.Round }{'\n'}
          </Text>
        </View>
        <Text h4>Notícias</Text>
        <View style = {{flex : 1, flexDirection : "row"}}>
          {
            this.state.news.map((v)=>{
              return (
                <Card title="GloboEsporte.com" key={v._id+Math.random()}
                >
                  <Text>
                    {v.Text}{'\n'}
                  </Text>
                  <Text
                    onPress={() => {
                      navigate("OpenURL", { titulo : "Globo Esporte", url : v.Url});
                    }}
                  >
                    Ler texto completo...
                  </Text>
                </Card>
              )
            })
          }
        </View>

        <Text h4>Escalação</Text>
        <View style = {{flex : 1, flexDirection : "row"}}>
          <View style = {{flex : 1, flexDirection : "column"}}>
            <Card title={`${this.state.homeTeam && this.state.homeTeam.Name}`}>
              {homeLineUp}
            </Card>
          </View>
          <View style = {{flex : 1, flexDirection : "column"}}>
          <Card title={`${this.state.awayTeam && this.state.awayTeam.Name}`}>
              {awayLineUp}
            </Card>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  matchSummary : {
    fontSize : 18
  },
  matchSummaryLeftItems : {
    fontWeight : 'bold'
  }
});

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength,padString) {
        targetLength = targetLength>>0; //floor if number or convert non-number to 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        }
        else {
            targetLength = targetLength-this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0,targetLength) + String(this);
        }
    };
}
