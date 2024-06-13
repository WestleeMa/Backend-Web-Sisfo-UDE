const db = require("../connect.js");

async function kajian(req, res) {
  const resQuery = await db("bidang_kajian");
  res.send(resQuery);
}

module.exports = kajian;
