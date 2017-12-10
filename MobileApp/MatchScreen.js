import React, { Component } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import DataRepo from './DataRepo';


export default class MatchScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      match : null
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
      })
  }

  render(){
    const { navigate } = this.props.navigation;
    let matchImage = null;
    if(this.state.match){
      image = <Image
        style = {{width : 150, height : 150}}
        source={{uri : `http://192.168.15.250:8080/img${this.state.match._id}.jpg`}}
      />
    }

    return (
      <ScrollView>
        <View style = {{flex : 1, flexDirection : "row"}}>
          {matchImage}
          <Text>
           Lorem Ipsum dolor sit amet.
          </Text>
        </View>
        <Text>
          {JSON.stringify(this.props)}
          {JSON.stringify(this.state)}
        </Text>
      </ScrollView>
    );
  }
}
