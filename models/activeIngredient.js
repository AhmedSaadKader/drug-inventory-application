const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ActiveIngredientSchema = new Schema({
  name: { type: String, required: true, index: true, unique: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

ActiveIngredientSchema.virtual("url").get(function () {
  return `/catalog/active/${this._id}`;
});

module.exports = mongoose.model("ActiveIngredient", ActiveIngredientSchema);
