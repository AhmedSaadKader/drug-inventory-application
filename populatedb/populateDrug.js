var async = require("async");

const data = require("./csvParseFunction");
var Drug = require("../models/drug");

var drugs = [];

function drugCreate(name, nameArabic, price, barcode, activeIngredient, cb) {
  drugDetail = { name, nameArabic, price };
  if (barcode != false) drugDetail.barcode = barcode;
  if (activeIngredient != false) drugDetail.activeIngredient = activeIngredient;

  var drug = new Drug(drugDetail);
  console.log(drug);

  drug.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Drug: " + drug);
    drugs.push(drug);
    cb(null, drug);
  });
}

const dataFunctionsList = data.map((item) => {
  return function (callback) {
    drugCreate(item.name, item.nameArabic, item.price, item.barcode, item.activeIngredient, callback);
  };
});

module.exports = function createDrugs(cb) {
  async.series(
    dataFunctionsList,
    // optional callback
    cb
  );
};
