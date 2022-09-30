const fs = require("fs");
const { parse } = require("csv-parse");

const data = fs.createReadStream("./Products.csv").pipe(
  parse({ delimiter: ",", columns: true, ltrim: true })
    .on("data", function (row) {
      return row;
    })
    .on("error", function (error) {
      console.log(error.message);
    })
    .on("end", function () {
      console.log("finished");
    })
);

// console.log("data", data);

module.exports = data;
