const { nextTick } = require("async");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const ActiveIngredient = require("../models/activeIngredient");
const async = require("async");

exports.categories_list = (req, res, next) => {
  Category.find()
    .sort([["name", "ascending"]])
    .exec(function (err, categories_list) {
      if (err) {
        return next(err);
      }
      res.render("category/category_list", {
        title: "Categories List",
        categories_list,
      });
    });
};

exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      activeIngredients(callback) {
        ActiveIngredient.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category === null) {
        const error = new Error("Category not found");
        error.status = 404;
        return next(error);
      }
      res.render("category/category_detail", {
        title: `Category: ${results.category.name} Details`,
        category: results.category,
        activeIngredients: results.activeIngredients,
      });
    }
  );
};

exports.category_create_get = (req, res) => {
  res.render("category/category_form", {
    title: "Create New Category",
    path: req.path,
  });
};

exports.category_create_post = [
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified")
    .isAlphanumeric()
    .withMessage("Name has none alphanumeric characters."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("category/category_form", {
        title: "Create New Category",
        category: req.body,
        errors: errors.array(),
      });
      return;
    }
    const category = new Category({
      name: req.body.name,
    });
    category.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(category.url);
    });
  },
];

exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      activeIngredients(callback) {
        ActiveIngredient.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category === null) {
        const error = new Error("Category not found");
        error.status = 404;
        return next(error);
      }
      res.render("category/category_delete", {
        title: `Delete Category: ${results.category.name}`,
        category: results.category,
        activeIngredients: results.activeIngredients,
      });
    }
  );
};

exports.category_delete_post = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      activeIngredients(callback) {
        ActiveIngredient.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.activeIngredients.length > 1) {
        res.render("category/category_delete", {
          title: `Delete Category: ${results.category.name}`,
          category: results.category,
          activeIngredients: results.activeIngredients,
        });
        return;
      }
      Category.findByIdAndRemove(req.body.categoryId, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/categories");
      });
    }
  );
};

exports.category_update_get = (req, res, next) => {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) {
      return next(err);
    }
    if (category == null) {
      const error = new Error("Category not found");
      error.status = 404;
      return next(error);
    }
    res.render("category/category_form", {
      title: `Update Category: ${category.name}`,
      category,
      path: req.path,
    });
  });
};

exports.category_update_post = [
  body("name").trim().isLength({ min: 1 }).escape().withMessage("Name must be specified"),
  (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      Category.findById(req.params.id).exec((err, cat) => {
        if (err) {
          return next(err);
        }
        res.render("category/category_form", {
          title: `Update Category: ${cat.name}`,
          category,
          errors: errors.array(),
          path: req.path,
        });
      });
      return;
    }
    Category.findByIdAndUpdate(req.params.id, category, {}, (err, updatedCategory) => {
      if (err) {
        return next(err);
      }
      res.redirect(updatedCategory.url);
    });
  },
];
