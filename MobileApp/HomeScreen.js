import React, { Component } from 'react';
import { Image, ScrollView, StatusBar, Text, View } from 'react-native';
import { Button, Card, Header } from 'react-native-elements';
import * as Util from './Util';

import DataRepo from './DataRepo';

export default class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      matches : [],
      url : ""
    }
  }
  static navigationOptions = {
    title : "AgoraNaTV"
  };

  componentDidMount(){
    let dr = new DataRepo();
    dr.getMatches()
    .then((v)=>{
      this.setState({matches : v});
    })
    .catch((e)=>{
      console.log(e);
    });

    this.setState({
      url : dr.formatDatabaseString()
    });

  }

  render(){
    const { navigate } = this.props.navigation;

    return (
      <View>
        <StatusBar
          hidden = {true}
        />
        <ScrollView horizontal>
          {
            this.state.matches.map((v,k)=>{
              return (
                <Card
                  image={{uri : Util.getImageUrl(v._id)}}
                  containerStyle={{
                    width : 250
                  }}
                  title={`${v.homeTeamName} x ${v.awayTeamName}`} key={v._id}
                >
                  <Text>
                    {`${v.venueName}, ${Util.formatDateStringToShortDateTime(v.StartDateTime)}`}{'\n'}
                  </Text>
                  <Button small title="Veja mais" onPress={() => {
                    navigate("Match", { matchId : v._id, matchDesc : `${v.homeTeamName} x ${v.awayTeamName}`});
                  }} />
                </Card>
              )
            })
          }
        </ScrollView>
      </View>
    );
  }
}
