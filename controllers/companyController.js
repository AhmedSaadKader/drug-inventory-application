const Company = require("../models/company");
const { body, validationResult } = require("express-validator");
const async = require("async");
const Drug = require("../models/drug");

exports.companies_list = (req, res) => {
  Company.find().exec((err, company_list) => {
    if (err) {
      return next(err);
    }
    res.render("company/company_list", {
      title: "Companies List",
      company_list,
      path: req.path,
    });
  });
};

exports.company_detail = (req, res, next) => {
  async.parallel(
    {
      company(callback) {
        Company.findById(req.params.id).exec(callback);
      },
      drugs(callback) {
        Drug.find({ company: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.company === null) {
        const error = new Error("Company not found");
        error.status = 404;
        return next(error);
      }
      res.render("company/company_detail", {
        title: `Company: ${results.company.name} details`,
        company: results.company,
        drugs: results.drugs,
        path: req.path,
      });
    }
  );
};

exports.company_create_get = (req, res) => {
  res.render("company/company_form", {
    title: "Create Company",
    path: req.path,
  });
};

exports.company_create_post = [
  body("name").trim().isLength({ min: 1 }).escape().withMessage("Name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    const company = new Company({
      name: req.body.name,
      path: req.path,
    });
    if (!errors.isEmpty()) {
      res.render("company/company_form", {
        title: "Create Company",
        company,
        errors: errors.array(),
      });
      return;
    }
    company.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect(company.url);
    });
  },
];

exports.company_delete_get = (req, res, next) => {
  async.parallel(
    {
      company(callback) {
        Company.findById(req.params.id).exec(callback);
      },
      drugs(callback) {
        Drug.find({ company: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.company === null) {
        res.redirect("/catalog/companies");
      }
      res.render("company/company_delete", {
        title: `Delete Company: ${results.company.name}`,
        company: results.company,
        drugs: results.drugs,
        path: req.path,
      });
    }
  );
};

exports.company_delete_post = (req, res, next) => {
  async.parallel(
    {
      company(callback) {
        Company.findById(req.params.id).exec(callback);
      },
      drugs(callback) {
        Drug.find({ company: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.drugs.length > 1) {
        res.render("company/company_delete", {
          title: `Delete Company: ${results.company.name}`,
          drugs: results.drugs,
          company: results.company,
        });
        return;
      }
      Company.findByIdAndRemove(req.body.companyId, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/catalog/companies");
      });
    }
  );
};

exports.company_update_get = (req, res, next) => {
  Company.findById(req.params.id).exec((err, company) => {
    if (err) {
      return next(err);
    }
    if (company == null) {
      const error = new Error("Company not found");
      error.status = 404;
      return next(error);
    }
    res.render("company/company_form", {
      title: `Update Company: ${company.name}`,
      company,
      path: req.path,
    });
  });
};

exports.company_update_post = [
  body("name").trim().isLength({ min: 1 }).escape().withMessage("Name must be specified"),
  (req, res, next) => {
    const errors = validationResult(req);
    const company = new Company({
      name: req.body.name,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      Company.findById(req.params.id).exec((err, comp) => {
        if (err) {
          return next(err);
        }
        res.render("company/company_form", {
          title: `Update Company: ${comp.name}`,
          company,
          errors: errors.array(),
        });
      });
      return;
    }
    Company.findByIdAndUpdate(req.params.id, company, {}, (err, updatedCompany) => {
      if (err) {
        return next(err);
      }
      res.redirect(updatedCompany.url);
    });
  },
];
