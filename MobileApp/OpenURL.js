import React, { Component } from 'react';
import {  WebView } from 'react-native';


export default class OpenURL extends Component {
  constructor(props){
    super(props);
  }
  static navigationOptions = ({navigation}) => ({
    title : navigation.state.params.titulo
  });

  render(){
    const { navigate } = this.props.navigation;

    return (
      <WebView
        source={{uri : this.props.navigation.state.params.url}}
      />
    );
  }
}
