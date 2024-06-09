const db = require("../connect.js");

async function dosen(req, res) {
  const resQuery = await db("dosen_pembimbing");
  res.send(resQuery);
}

module.exports = dosen;
