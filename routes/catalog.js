const express = require("express");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.filename + "-" + Date.now());
  },
});

const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
  const reject = () => {
    res.setHeader("www-authenticate", "Basic");
    res.sendStatus(401);
  };
  const authorization = req.headers.authorization;

  if (!authorization) {
    return reject();
  }

  const [username, password] = Buffer.from(authorization.replace("Basic ", ""), "base64").toString().split(":");

  if (!(username === "admin" && password === "asa")) {
    return reject();
  }

  next();
};

const drug_controller = require("../controllers/drugController");
const active_controller = require("../controllers/activeController");
const company_controller = require("../controllers/companyController");
const category_controller = require("../controllers/categoryController");
const drugInstance_controller = require("../controllers/drugInstanceController");
const supplier_controller = require("../controllers/supplierController");

router.get("/", drug_controller.index);

router.get("/drug/create", drug_controller.drug_create_get);
router.post("/drug/create", upload.single("image"), drug_controller.drug_create_post);
router.get("/drug/:id/delete", authMiddleware, drug_controller.drug_delete_get);
router.post("/drug/:id/delete", authMiddleware, drug_controller.drug_delete_post);
router.get("/drug/:id/update", authMiddleware, drug_controller.drug_update_get);
router.post("/drug/:id/update", upload.single("image"), drug_controller.drug_update_post);
router.get("/drug/:id", drug_controller.drug_detail);
router.get("/drugs", drug_controller.drug_list);

router.get("/active/create", active_controller.actives_create_get);
router.post("/active/create", active_controller.actives_create_post);
router.get("/active/:id/delete", authMiddleware, active_controller.actives_delete_get);
router.post("/active/:id/delete", authMiddleware, active_controller.actives_delete_post);
router.get("/active/:id/update", authMiddleware, active_controller.actives_update_get);
router.post("/active/:id/update", authMiddleware, active_controller.actives_update_post);
router.get("/active/:id", active_controller.actives_detail);
router.get("/actives", active_controller.actives_list);

router.get("/company/create", company_controller.company_create_get);
router.post("/company/create", company_controller.company_create_post);
router.get("/company/:id/delete", authMiddleware, company_controller.company_delete_get);
router.post("/company/:id/delete", authMiddleware, company_controller.company_delete_post);
router.get("/company/:id/update", authMiddleware, company_controller.company_update_get);
router.post("/company/:id/update", authMiddleware, company_controller.company_update_post);
router.get("/company/:id", company_controller.company_detail);
router.get("/companies", company_controller.companies_list);

router.get("/category/create", category_controller.category_create_get);
router.post("/category/create", category_controller.category_create_post);
router.get("/category/:id/delete", authMiddleware, category_controller.category_delete_get);
router.post("/category/:id/delete", authMiddleware, category_controller.category_delete_post);
router.get("/category/:id/update", authMiddleware, category_controller.category_update_get);
router.post("/category/:id/update", authMiddleware, category_controller.category_update_post);
router.get("/category/:id", category_controller.category_detail);
router.get("/categories", category_controller.categories_list);

router.get("/drugInstance/create", drugInstance_controller.drugInstance_create_get);
router.post("/drugInstance/create", drugInstance_controller.drugInstance_create_post);
router.get("/drugInstance/:id/delete", authMiddleware, drugInstance_controller.drugInstance_delete_get);
router.post("/drugInstance/:id/delete", authMiddleware, drugInstance_controller.drugInstance_delete_post);
router.get("/drugInstance/:id/update", authMiddleware, drugInstance_controller.drugInstance_update_get);
router.post("/drugInstance/:id/update", authMiddleware, drugInstance_controller.drugInstance_update_post);
router.get("/drugInstance/:id", drugInstance_controller.drugInstance_detail);
router.get("/drugInstances", drugInstance_controller.drugInstances_list);

router.get("/supplier/create", supplier_controller.supplier_create_get);
router.post("/supplier/create", supplier_controller.supplier_create_post);
router.get("/supplier/:id/delete", supplier_controller.supplier_delete_get);
router.post("/supplier/:id/delete", supplier_controller.supplier_delete_post);
router.get("/supplier/:id/update", supplier_controller.supplier_update_get);
router.post("/supplier/:id/update", supplier_controller.supplier_update_post);
router.get("/supplier/:id", supplier_controller.supplier_detail);
router.get("/suppliers", supplier_controller.supplier_list);

module.exports = router;
