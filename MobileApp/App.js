import React, { Component } from "react";
import { StackNavigator } from "react-navigation";
import HomeScreen from "./HomeScreen";
import MatchScreen from "./MatchScreen";
import OpenURL from "./OpenURL";


const AgoraNaTV = StackNavigator({
  Home: { screen : HomeScreen },
  Match: { screen : MatchScreen },
  OpenURL: { screen : OpenURL }
}, {
  initialRouteName: "Home"
});

export default class App extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return <AgoraNaTV />;
  }
}
