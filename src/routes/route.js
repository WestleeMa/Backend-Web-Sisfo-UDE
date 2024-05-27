const info = require("../controllers/infos");
const { login, register } = require("../controllers/auth");
const dosen = require("../controllers/dosen");
const express = require("express");
const router = express.Router();

router.get("/info", info);
router.post("/login", login);
router.post("/regist", register);
router.get("/dosen", dosen);

module.exports = router;
