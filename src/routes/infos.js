const db = require("../connect.js");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const resQuery = await db.select().from("infos");
  res.send(resQuery[0]);
});

module.exports = router;
