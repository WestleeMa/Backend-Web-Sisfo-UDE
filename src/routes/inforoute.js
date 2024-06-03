const { info, infoImage, addOrEditInfo } = require("../controllers/infos");
const express = require("express");
const router = express.Router();

router.get("/", info);
router.get("/image", infoImage);
router.post("/aoe", addOrEditInfo);

module.exports = router;
