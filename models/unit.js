const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UnitSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ["Main", "Minor"] },
});

UnitSchema.virtual("url").get(function () {
  return `/catalog/unit/${this._id}`;
});

module.exports = mongoose.model("Unit", UnitSchema);
