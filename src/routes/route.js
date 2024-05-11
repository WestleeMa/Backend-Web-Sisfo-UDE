const info = require("../controllers/infos");
const login = require("../controllers/login");
const express = require("express");
const router = express.Router();

router.get("/info", info);
router.post("/login", login);

module.exports = router;
