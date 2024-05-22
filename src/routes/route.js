const info = require("../controllers/infos");
const login = require("../controllers/login");
const dosen = require("../controllers/dosen");
const express = require("express");
const router = express.Router();

router.get("/info", info);
router.post("/login", login);
router.get("/dosen", dosen);

module.exports = router;
