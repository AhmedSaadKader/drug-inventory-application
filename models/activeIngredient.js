const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ActiveIngredientSchema = new Schema({
  name: { type: String, required: true },
  // category: { type: Schema.type.ObjectId, ref: "Category" },
});

ActiveIngredientSchema.virtual("url").get(function () {
  return `/catalog/activeIngredient/${this._id}`;
});

module.exports = mongoose.model("ActiveIngredient", ActiveIngredientSchema);
