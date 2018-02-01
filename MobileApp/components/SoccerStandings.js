import React, {Component} from "react";
import {FlatList, Text, StyleSheet, View} from "react-native";
import DataRepo from "../DataRepo.js";

export default class SoccerStandings extends Component{
  constructor(props){
    super(props);
    this.state = {
      standings: []
    };
  }

  componentDidMount(){
    (new DataRepo()).getLatestStandingForChampionship("champCampeonatoBRSerieA2017")
      .then((data) => {
        this.setState({standings: data});
      })
      .catch((error) => {
        this.setState({standings: error});
      });
  }

  render(){
    return (
      <View>
        <FlatList
          data={this.state.standings.Standings}
          keyExtractor={(item, index) => index}
          renderItem={({item, index}) => {
            if(index == 0){
              <View style={styles.table}>
                <Text style={styles.tableLine}></Text>
                <Text style={styles.tableLine}>J</Text>
                <Text style={styles.tableLine}>V</Text>
                <Text style={styles.tableLine}>E</Text>
                <Text style={styles.tableLine}>D</Text>
                <Text style={styles.tableLine}>GP</Text>
                <Text style={styles.tableLine}>GC</Text>
                <Text style={styles.tableLine}>SG</Text>
                <Text style={styles.tableLine}>P</Text>
              </View>
            }
            return (
              <View style={styles.table}>
                <Text style={styles.tableLine}>{item.TeamId}</Text>
                <Text style={styles.tableLine}>{item.Played}</Text>
                <Text style={styles.tableLine}>{item.Wins}</Text>
                <Text style={styles.tableLine}>{item.Draws}</Text>
                <Text style={styles.tableLine}>{item.Losses}</Text>
                <Text style={styles.tableLine}>{item.GoalsFor}</Text>
                <Text style={styles.tableLine}>{item.GoalsAgainst}</Text>
                <Text style={styles.tableLine}>{item.GoalsFor-item.GoalsAgainst}</Text>
                <Text style={styles.tableLine}>{item.Points}</Text>
              </View>
            );

          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  table:{
    alignSelf: "stretch",
    flex: 0.8,
    flexDirection: "row"
  },
  tableLine:{
    alignSelf: "stretch",
    backgroundColor: "white",
    borderColor: "#ccc",
    borderWidth: 0.6,
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center"
  }
});
