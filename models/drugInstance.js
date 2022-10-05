const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DrugInstanceSchema = new Schema({
  drug: { type: Schema.Types.ObjectId, required: true, ref: "Drug" },
  expiryDate: { type: Date, required: true },
  purchasePrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  supplier: { type: Schema.Types.ObjectId, required: true, ref: "Supplier" },
  purchaseDate: { type: Date, required: true },
});

DrugInstanceSchema.virtual("url").get(function () {
  return `/catalog/drugInstance/${this._id}`;
});

module.exports = mongoose.model("DrugInstance", DrugInstanceSchema);
