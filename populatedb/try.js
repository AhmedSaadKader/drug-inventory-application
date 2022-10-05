const async = require("async");
const mongoose = require("mongoose");

const Drug = require("../models/drug");
const ActiveIngredient = require("../models/activeIngredient");
async function main() {
  const mongodb = "mongodb+srv://ahmedsaad:719vI8jKhyO2fn4O@cluster0.ignr5qa.mongodb.net/?retryWrites=true&w=majority";
  mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;

  const conn = await db.collection("activeingredients").distinct("name");
  console.log(conn.length);

  const duplicates = ActiveIngredient.aggregate([
    { $group: { _id: "$name", count: { $sum: 1 } } },
    { $match: { _id: { $ne: null }, count: { $gt: 1 } } },
    { $sort: { count: -1 } },
    { $project: { name: "$_id", _id: 0 } },
  ]).exec((err, results) => {
    console.log(results);
  });

  duplicates;

  const actives = await ActiveIngredient.find();

  const duplicatesList = [];

  for (let a = 0; a < actives.length; a++) {
    const element = actives[a];
    const allElements = await ActiveIngredient.find({ name: element.name });
    if (allElements.length > 1) {
      duplicatesList.push(allElements);
      allElements.shift();
      await ActiveIngredient.findByIdAndRemove([...allElements][0]._id);
    }
  }

  console.log("done");
  mongoose.connection.close();
}

main().catch((err) => console.log(err));
