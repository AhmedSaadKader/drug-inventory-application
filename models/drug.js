const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DrugSchema = new Schema({
  name: { type: String, required: true },
  nameArabic: { type: String },
  activeIngredient: { type: Schema.Types.ObjectId, ref: "ActiveIngredient" },
  company: { type: Schema.Types.ObjectId, ref: "Company" },
  price: { type: Number, required: true },
  barcode: { type: String },
  // mainUnit: { type: Schema.type.ObjectId, ref: "Unit" },
  // minorUnit: { type: Schema.type.ObjectId, ref: "Unit" },
  image: {
    data: Buffer,
    contentType: String,
  },
});

DrugSchema.virtual("url").get(function () {
  return `/catalog/drug/${this._id}`;
});

module.exports = mongoose.model("Drug", DrugSchema);
