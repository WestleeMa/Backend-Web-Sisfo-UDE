const express = require("express");
const router = express.Router();
const {
  form1,
  form2,
  form3,
  form4,
  delForm1,
  delForm2,
  delForm3,
  delForm4,
  viewForm1,
  viewForm2,
  viewForm3,
  viewForm4,
} = require("../controllers/forms");

router.get("/1", viewForm1);
router.get("/2", viewForm2);
router.get("/3", viewForm3);
router.get("/4", viewForm4);
router.post("/1", form1);
router.post("/2", form2);
router.post("/3", form3);
router.post("/4", form4);
router.delete("/1", delForm1);
router.delete("/2", delForm2);
router.delete("/3", delForm3);
router.delete("/4", delForm4);

module.exports = router;
