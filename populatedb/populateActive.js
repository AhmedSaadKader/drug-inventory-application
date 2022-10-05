var async = require("async");
const mongoose = require("mongoose");

const data = require("./csvParseFunction");

var ActiveIngredient = require("../models/activeIngredient");

var activeIngredients = [];

function activeIngredientCreate(name, cb) {
  if (name !== false) {
    var activeIngredient = new ActiveIngredient({ name: name });

    activeIngredient.save(function (err) {
      if (err) {
        cb(err, null);
        return;
      }
      //   console.log("New ActiveIngredient: " + activeIngredient);
      activeIngredients.push(activeIngredient);
      cb(null, activeIngredient);
    });
  } else {
    return;
  }
}

const dataFunctionsList = data
  .filter((x) => x.activeIngredient != false)
  .map((item) => {
    return function (callback) {
      activeIngredientCreate(item.activeIngredient, callback);
    };
  });

module.exports = function createActiveIngredients(cb) {
  async.series(
    dataFunctionsList,
    // optional callback
    cb
  );
};
