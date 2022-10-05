const ActiveIngredient = require("../models/activeIngredient");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const async = require("async");
const Drug = require("../models/drug");

exports.actives_list = (req, res, next) => {
  ActiveIngredient.find()
    .sort([["name", "ascending"]])
    .exec(function (err, actives_list) {
      if (err) {
        return next(err);
      }
      res.render("active/activeIngredient_list", {
        title: "Active Ingredients List",
        actives_list,
        path: req.path,
      });
    });
};

exports.actives_detail = (req, res, next) => {
  async.parallel(
    {
      activeIngredient(callback) {
        ActiveIngredient.findById(req.params.id).populate("category").exec(callback);
      },
      drugs(callback) {
        Drug.find({ activeIngredient: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.activeIngredient == null) {
        const err = new Error("Active Ingredient not found");
        err.status = 404;
        return next(err);
      }
      res.render("active/activeIngredient_detail", {
        title: `${results.activeIngredient.name} details`,
        activeIngredient: results.activeIngredient,
        drugs: results.drugs,
        path: req.path,
      });
    }
  );
};

exports.actives_create_get = (req, res, next) => {
  Category.find().exec((err, category_list) => {
    if (err) {
      return next(err);
    }
    res.render("active/activeIngredient_form", {
      title: "Create Active Ingredient",
      path: req.path,
      category_list,
    });
  });
};

exports.actives_create_post = [
  body("name").trim().isLength({ min: 1 }).escape().withMessage("Active Ingredient name must be specified"),
  (req, res, next) => {
    const errors = validationResult(req);
    const activeIngredient = new ActiveIngredient({
      name: req.body.name,
      category: req.body.category,
    });
    if (!errors.isEmpty()) {
      Category.find().exec((err, category_list) => {
        if (err) {
          return next(err);
        }
        res.render("active/activeIngredient_form", {
          title: "Create Active Ingredient",
          path: req.path,
          activeIngredient,
          category_list,
          errors: errors,
        });
        return;
      });
    }

    activeIngredient.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(activeIngredient.url);
    });
  },
];

exports.actives_delete_get = (req, res, next) => {
  async.parallel(
    {
      activeIngredient(callback) {
        ActiveIngredient.findById(req.params.id).populate("category").exec(callback);
      },
      drugs(callback) {
        Drug.find({ activeIngredient: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.activeIngredient === null) {
        res.redirect("/catalog/actives");
      }
      res.render("active/activeIngredient_delete", {
        title: `Delete Active Ingredient: ${results.activeIngredient.name}`,
        activeIngredient: results.activeIngredient,
        drugs: results.drugs,
        path: req.path,
      });
    }
  );
};

exports.actives_delete_post = (req, res, next) => {
  async.parallel(
    {
      activeIngredient(callback) {
        ActiveIngredient.findById(req.params.id).exec(callback);
      },
      drugs(callback) {
        Drug.find({ activeIngredient: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.drugs.length > 1) {
        res.render("active/activeIngredient_delete", {
          title: `Delete Active Ingredient: ${results.activeIngredient.name}`,
          activeIngredient: results.activeIngredient,
          drugs: results.drugs,
          path: req.path,
        });
        return;
      }
      ActiveIngredient.findByIdAndRemove(req.body.activeId, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/actives");
      });
    }
  );
};

exports.actives_update_get = (req, res, next) => {
  async.parallel(
    {
      activeIngredient(callback) {
        ActiveIngredient.findById(req.params.id).exec(callback);
      },
      category_list(callback) {
        Category.find().exec(callback);
      },
    },
    (err, results) => {
      console.log(req.path == "/active/:id/update");
      if (err) {
        return next(err);
      }
      if (results.activeIngredient == null) {
        const err = new Error("Active Ingredient not found");
        err.status = 404;
        return next(err);
      }
      res.render("active/activeIngredient_form", {
        title: `Update Active Ingredient: ${results.activeIngredient.name}`,
        activeIngredient: results.activeIngredient,
        category_list: results.category_list,
        path: req.path,
      });
    }
  );
};

exports.actives_update_post = [
  body("name").trim().isLength({ min: 1 }).escape().withMessage("Name must be specified"),
  (req, res, next) => {
    const errors = validationResult(req);
    const activeIngredient = new ActiveIngredient({
      name: req.body.name,
      category: req.body.category,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      Category.find().exec((err, category_list) => {
        if (err) {
          return next(err);
        }
        res.render("active/activeIngredient_form", {
          title: `Update Active Ingredient`,
          activeIngredient,
          category_list,
          errors,
        });
      });
      return;
    }
    ActiveIngredient.findByIdAndUpdate(req.params.id, activeIngredient, {}, (err, updatedActive) => {
      if (err) {
        return next(err);
      }
      res.redirect(updatedActive.url);
    });
  },
];
