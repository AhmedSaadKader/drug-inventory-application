const express = require("express");
const router = express.Router();

const drug_controller = require("../controllers/drugController");
const active_controller = require("../controllers/activeController");

router.get("/", drug_controller.index);

router.get("/drug/create", drug_controller.drug_create_get);
router.post("/drug/create", drug_controller.drug_create_post);
router.get("/drug/:id/delete", drug_controller.drug_delete_get);
router.post("/drug/:id/delete", drug_controller.drug_delete_post);
router.get("/drug/:id/update", drug_controller.drug_update_get);
router.post("/drug/:id/update", drug_controller.drug_update_post);
router.get("/drug/:id", drug_controller.drug_detail);
router.get("/drugs", drug_controller.drug_list);

router.get("/active/create", active_controller.actives_create_get);
router.post("/active/create", active_controller.actives_create_post);
router.get("/active/:id/delete", active_controller.actives_delete_get);
router.post("/active/:id/delete", active_controller.actives_delete_post);
router.get("/active/:id/update", active_controller.actives_update_get);
router.post("/active/:id/update", active_controller.actives_update_post);
router.get("/active/:id", active_controller.actives_detail);
router.get("/actives", active_controller.actives_list);

module.exports = router;
