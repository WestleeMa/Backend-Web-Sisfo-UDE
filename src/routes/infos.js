const db = require("../connect.js");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const query = "SELECT * FROM infos";
  db.query(query, (err, result) => {
    if (err) {
      throw err;
    } else {
      console.log(result[0]);
      res.send(result[0]);
    }
  });
});

module.exports = router;
