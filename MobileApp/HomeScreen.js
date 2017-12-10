import React, { Component } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Button, Card, Header } from 'react-native-elements';

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
        <ScrollView horizontal>
          {
            this.state.matches.map((v,k)=>{
              return (
                <Card title={`${v.homeTeamName} x ${v.awayTeamName}`} key={v._id}>
                  <Image
                    style = {{width : 100, height : 100}}
                    source={{uri : `http://192.168.15.250:8080/img${v._id}.jpg`}}
                  />
                  <Text>
                    {new Date(v.StartDateTime).toLocaleDateString()+" "+new Date(v.StartDateTime).toLocaleTimeString()}{'\n'}
                    {v.VenueName}
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
