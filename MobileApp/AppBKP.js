import React, { Component } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Card, Header } from 'react-native-elements';


export default class App extends Component {
  constructor(props){
    super(props);
    this.state = { text : '' };
  }

  _alertLoser(){
    Alert.alert(this.state.text);
  }

  render(){
    return (
      <View style = {{ padding : 20}}>
        <Text>
        Futebol
        </Text>
        <ScrollView horizontal>
          <Card title="Vasco x Flamengo">
            <Image
              style = {{width : 130, height : 130}}
              source={{uri : 'http://sportlink.com.br/wp-content/uploads/2017/02/futebol-society.png'}}
            />
            <Text>
              01/04/2017{'\n'}
              São Januário
            </Text>
          </Card>
        </ScrollView>
      </View>
    );
  }
}
