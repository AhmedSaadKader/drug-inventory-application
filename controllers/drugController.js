const Drug = require("../models/drug");
const async = require("async");

exports.index = (req, res) => {
  res.render("index", {
    title: "Complete Drug Database",
  });
};

exports.drug_list = (req, res) => {
  res.send("NOT IMPEMENTED: drug List");
};

exports.drug_list = (req, res) => {
  res.send("NOT IMPEMENTED: drug List");
};

exports.drug_detail = (req, res) => {
  res.send(`NOT IMPEMENTED: drug detail: ${req.params.id} `);
};

exports.drug_create_get = (req, res) => {
  res.send("NOT IMPEMENTED: drug create POST");
};

exports.drug_create_post = (req, res) => {
  res.send("NOT IMPEMENTED: drug create POST");
};

exports.drug_delete_get = (req, res) => {
  res.send("NOT IMPEMENTED: drug delete GET");
};

exports.drug_delete_post = (req, res) => {
  res.send("NOT IMPEMENTED: drug delete POST");
};

exports.drug_update_get = (req, res) => {
  res.send("NOT IMPEMENTED: drug update GET");
};

exports.drug_update_post = (req, res) => {
  res.send("NOT IMPEMENTED: drug update POST");
};
