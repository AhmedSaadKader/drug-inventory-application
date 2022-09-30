const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PharmaceuticalFormSchema = new Schema({
  name: { type: String, required: true },
});

PharmaceuticalFormSchema.virtual("url").get(function () {
  return `/catalog/pharmaceuticalForm/${this._id}`;
});

module.exports = mongoose.model("PharmaceuticalForm", PharmaceuticalFormSchema);
