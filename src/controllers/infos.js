const db = require("../connect.js");

async function info(req, res) {
  const resQuery = await db("infos");
  res.send(resQuery[0]);
}

module.exports = info;
