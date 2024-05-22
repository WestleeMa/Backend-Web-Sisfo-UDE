const db = require("../connect.js");

async function info(req, res) {
  const resQuery = await db("infos");
  res.send(resQuery);
}

module.exports = info;
