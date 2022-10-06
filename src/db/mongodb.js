const mongoose = require("mongoose");

const mongodb = {
  init: () => {
    mongoose.connect('mongodb://localhost:27017/clusterdev-db', {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.once("open", function () {
      console.log("DB Connected successfully");
    });
  }
}

module.exports = mongodb;