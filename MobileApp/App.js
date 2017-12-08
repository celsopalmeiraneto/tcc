import React, { Component } from 'react';
import { View } from 'react-native';
import { StackNavigator } from 'react-navigation';
import HomeScreen from './HomeScreen';
import MatchScreen from './MatchScreen';

const BasicApp = StackNavigator({
  Main : { screen : HomeScreen },
  Match : { screen : MatchScreen }
})

export default class App extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return <BasicApp />;
  }
}
