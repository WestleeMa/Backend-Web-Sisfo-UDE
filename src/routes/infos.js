const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    1: { title: "info 1", desc: "info desc 1", photo: null },
    2: { title: "info 2", desc: "info desc 2", photo: null },
    3: { title: "info 3", desc: "info desc 3", photo: null },
    4: { title: "hehe", desc: "hehe deskripsinya ini", photo: null },
  });
});

module.exports = router;
