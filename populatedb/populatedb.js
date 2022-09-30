#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");

const createDrugs = require("./populateDrug");
const createActiveIngredients = require("./populateActive");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

async.series([createActiveIngredients], function (err, results) {
  if (err) {
    console.log("FINAL ERR: " + err);
  } else {
    console.log("done");
  }
  // All done, disconnect from database
  mongoose.connection.close();
});
