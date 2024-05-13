const express = require("express");
const router = express.Router();
const { form1, form2, form3, form4 } = require("../controllers/forms");

router.post("/1", form1);
router.post("/2", form2);
router.post("/3", form3);
router.post("/4", form4);

module.exports = router;
