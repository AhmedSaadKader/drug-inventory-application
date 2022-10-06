const Drug = require("../models/drug");
const async = require("async");
const DrugInstance = require("../models/drugInstance");
const Category = require("../models/category");
const Company = require("../models/company");
const ActiveIngredient = require("../models/activeIngredient");
const Supplier = require("../models/supplier");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

exports.index = (req, res) => {
  async.parallel(
    {
      drug_count(callback) {
        Drug.countDocuments({}, callback);
      },
      drugInstance_count(callback) {
        DrugInstance.countDocuments({}, callback);
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      },
      company_count(callback) {
        Company.countDocuments({}, callback);
      },
      activeIngredient_count(callback) {
        ActiveIngredient.countDocuments({}, callback);
      },
      supplier_count(callback) {
        Supplier.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        path: req.path,
        title: "Complete Drug Database",
        error: err,
        data: results,
      });
    }
  );
};

exports.drug_list = (req, res, next) => {
  Drug.find({}, "name activeIngredient price")
    .sort({ title: 1 })
    .populate({ path: "activeIngredient", populate: { path: "category" } })
    .exec(function (err, list_drug) {
      if (err) {
        return next(err);
      }
      res.render("drug/drugs_list", {
        title: "Drugs List",
        list_drug,
        path: req.path,
      });
    });
};

exports.drug_detail = (req, res, next) => {
  async.parallel(
    {
      drug(callback) {
        Drug.findById(req.params.id)
          .populate({ path: "activeIngredient", populate: { path: "category" } })
          .populate("company")
          .exec(callback);
      },
      drugInstances(callback) {
        DrugInstance.find({ drug: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.drug === null) {
        const error = new Error("Drug not found");
        error.status = 404;
        return next(error);
      }
      res.render("drug/drug_detail", {
        title: `Drug: ${results.drug.name} details`,
        drug: results.drug,
        drugInstances: results.drugInstances,
        path: req.path,
      });
    }
  );
};

exports.drug_create_get = (req, res, next) => {
  async.parallel(
    {
      activeIngredients(callback) {
        ActiveIngredient.find(callback);
      },
      companies(callback) {
        Company.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("drug/drug_form", {
        title: "Create Drug",
        companies: results.companies,
        activeIngredients: results.activeIngredients,
        path: req.path,
      });
    }
  );
};

exports.drug_create_post = [
  body("name").trim().isLength({ min: 1 }).escape().withMessage("Name must be specified"),
  body("nameArabic").trim().escape(),
  body("activeIngredient").trim().isLength({ min: 1 }).escape(),
  body("company").trim().isLength({ min: 1 }).escape(),
  body("price").trim().isLength({ min: 1 }).escape(),
  body("barcode").trim().escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const drug = new Drug({
      name: req.body.name,
      nameArabic: req.body.nameArabic,
      activeIngredient: req.body.activeIngredient,
      company: req.body.company,
      price: req.body.price,
      barcode: req.body.barcode,
      image: req.file
        ? {
            data: fs.readFileSync(path.join(__dirname, "..", "uploads", req.file.filename)),
            contentType: "image/png",
          }
        : null,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          activeIngredients(callback) {
            ActiveIngredient.find(callback);
          },
          companies(callback) {
            Company.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render("drug/drug_form", {
            title: "Create Drug",
            drug,
            activeIngredients: results.activeIngredients,
            companies: results.companies,
            path: req.path,
            errors,
          });
        }
      );
      return;
    }
    drug.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(drug.url);
    });
  },
];

exports.drug_delete_get = (req, res, next) => {
  async.parallel(
    {
      drug(callback) {
        Drug.findById(req.params.id).exec(callback);
      },
      drugInstances(callback) {
        DrugInstance.find({ drug: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.drug === null) {
        res.redirect("/catalog/drugs");
      }
      res.render("drug/drug_delete", {
        title: `Delete Drug: ${results.drug.name}`,
        drug: results.drug,
        drugInstances: results.drugInstances,
        path: req.path,
      });
    }
  );
};

exports.drug_delete_post = (req, res, next) => {
  console.log("hi");
  async.parallel(
    {
      drug(callback) {
        Drug.findById(req.params.id).exec(callback);
      },
      drugInstances(callback) {
        DrugInstance.find({ drug: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.drug === null) {
        res.redirect("/catalog/drugs");
      }
      if (results.drugInstances.length > 1) {
        res.render("drug/drug_delete", {
          title: `Delete Drug: ${results.drug.name}`,
          drug: results.drug,
          drugInstances: results.drugInstances,
          path: req.path,
        });
        return;
      }
      console.log("hi");
      Drug.findByIdAndRemove(req.body.drugId, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/drugs");
      });
    }
  );
};

exports.drug_update_get = (req, res, next) => {
  async.parallel(
    {
      drug(callback) {
        Drug.findById(req.params.id).exec(callback);
      },
      activeIngredients(callback) {
        ActiveIngredient.find().exec(callback);
      },
      companies(callback) {
        Company.find().exec(callback);
      },
    },
    (error, results) => {
      if (error) {
        return next(error);
      }
      if (results.drug === null) {
        const err = new Error("Drug not found");
        err.status = 404;
        return next(err);
      }
      res.render("drug/drug_form", {
        title: `Update Drug: ${results.drug.name}`,
        drug: results.drug,
        activeIngredients: results.activeIngredients,
        companies: results.companies,
        path: req.path,
      });
    }
  );
};

exports.drug_update_post = [
  body("name").trim().isLength({ min: 1 }).escape().withMessage("Name must be specified"),
  body("nameArabic").trim().escape(),
  body("price").trim().isLength({ min: 1 }).escape().withMessage("Price must be specified"),
  body("barcode").trim().escape(),
  body("activeIngredient").trim().isLength({ min: 1 }).escape().withMessage("Active Ingredient must be specified"),
  body("company").trim().isLength({ min: 1 }).escape().withMessage("Company must be specified"),
  (req, res, next) => {
    const errors = validationResult(req);
    const drug = new Drug({
      name: req.body.name,
      nameArabic: req.body.nameArabic,
      price: req.body.price,
      barcode: req.body.barcode,
      activeIngredient: req.body.activeIngredient,
      company: req.body.company,
      image: req.file
        ? {
            data: fs.readFileSync(path.join(__dirname, "..", "uploads", req.file.filename)),
            contentType: "image/png",
          }
        : null,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          drug(callback) {
            Drug.findById(req.params.id).exec(callback);
          },
          activeIngredients(callback) {
            ActiveIngredient.find().exec(callback);
          },
          companies(callback) {
            Company.find().exec(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }
          res.render("drug/drug_form", {
            title: `Update Drug: ${results.drug.name}`,
            activeIngredients: results.activeIngredients,
            companies: results.companies,
            errors: errors.array(),
            drug,
          });
        }
      );
      return;
    }
    Drug.findByIdAndUpdate(req.params.id, drug, {}, (err, updatedDrug) => {
      if (err) {
        return next(err);
      }
      res.redirect(updatedDrug.url);
    });
  },
];
