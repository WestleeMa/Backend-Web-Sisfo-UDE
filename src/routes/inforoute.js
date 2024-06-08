const {
  info,
  infoImage,
  addOrEditInfo,
  delInfo,
} = require("../controllers/infos");
const express = require("express");
const router = express.Router();

router.get("/", info);
router.delete("/", delInfo);
router.get("/image", infoImage);
router.post("/aoe", addOrEditInfo);

module.exports = router;
