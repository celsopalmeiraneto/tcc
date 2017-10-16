"use strict";

const PouchDB = require("pouchdb");
PouchDB.plugin(require("pouchdb-find"));

const connectionLimit = 15;
var   currentConnections = 0;
const connectionWaitTime = 30000;
const connectionInterval = 500;

var connection = null;

exports.getPouchDBConnection = function () {
  if(!connection){
    try{
      connection = _getConnection();
    }catch(e){
      console.log("Deu pau ao pegar uma conexão.");
    }
  }
  return connection;

  var db;
  if(currentConnections < connectionLimit){
    db = _getConnection();
    currentConnections++;
  }else{
    var tentative = 0;
    var tm = setInterval(() => {
      if(currentConnections <= connectionLimit){
        db = _getConnection();
        currentConnections++;
        clearInterval(tm);
        return void(0);
      }else{
        tentative += connectionInterval;
      }
    }, connectionInterval);
    while(db == null && tentative < connectionWaitTime){

    }
  }
  if(!db){
    throw new Error("Unable to get DB connection.");
  }
  return db;
};

exports.disposePouchDBConnection = async function(db){
  await db.close();
  currentConnections --;
  return true;
};

function _getConnection(){
  try{
    console.log("CONNECTION TO POUCHDB");
    return new PouchDB("http://127.0.0.1:5984/tcc", {
      auth : {
        username : "crawler",
        password : "cr4wl3r"
      },
      skip_setup : true
    });
  }catch(e){
    throw new Error("Failed to connect to the database.");
  }

}
