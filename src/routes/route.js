const {
  login,
  register,
  updateUser,
  deleteUser,
  viewUser,
  userPhoto,
  userChangePass,
} = require("../controllers/auth");
const dosen = require("../controllers/dosen");
const kajian = require("../controllers/bidang_kajian");
const skema = require("../controllers/skema_skripsi");
const links = require("../controllers/links");
const express = require("express");
const router = express.Router();

router.post("/login", login);
router.post("/regist", register);
router.post("/userUp", updateUser);
router.post("/changepass", userChangePass);
router.delete("/userUp", deleteUser);
router.get("/user", viewUser);
router.get("/userImg", userPhoto);
router.get("/dosen", dosen);
router.get("/kajian", kajian);
router.get("/skema", skema);
router.get("/links", links);

module.exports = router;
