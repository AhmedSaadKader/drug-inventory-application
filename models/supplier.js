const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SupplierSchema = new Schema({
  name: { type: String, required: true, maxLength: 30 },
  phone: { type: Number },
});

SupplierSchema.virtual("url").get(function () {
  return `/catalog/supplier/${this._id}`;
});

module.exports = mongoose.model("Supplier", SupplierSchema);
