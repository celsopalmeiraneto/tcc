"use strict";

const DBConnector = require("./model/DBConnector.js");

var db = DBConnector.getPouchDBConnection();

db.find({
  selector: {
    type : "SoccerMatch"
  },
  limit : 500
})
  .then((v) => {
    v.docs.forEach((v) => {
      console.log(v);
    });
  });

/*
db.find({
  selector: {
    _id : { $regex : "(matchSoccer)"}
  },
  limit : 500
})
  .then((v) => {
    v.docs.forEach((v) => {
      db.remove(v._id, v._rev)
        .then((v) => {
          console.log("Deletado");
        });
    });
  });

/*
*/
db.query("VenueDocs/venueByNameCity")
  .then((v) => {
    v.rows.forEach((value) => {
      db.remove(value.value._id, value.value._rev)
        .then((v) => {
          console.log("Deletado");
        });
    });
  })
  .catch((e) => {
    console.log(e);
  })

*/
