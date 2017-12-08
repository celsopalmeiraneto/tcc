import React, { Component } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Card, Header } from 'react-native-elements';


export default class MatchScreen extends Component {
  constructor(props){
    super(props);
  }
  static navigationOptions = {
    title : "MyFreakinTitle"
  };

  render(){
    const { navigate } = this.props.navigation;
    return (
      <View>
        <Text>
        Futebol
        </Text>
      </View>
    );
  }
}
