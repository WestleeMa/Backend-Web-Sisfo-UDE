const db = require("../connect.js");

async function skema(req, res) {
  const resQuery = await db("skema_skripsi");
  res.send(resQuery);
}

module.exports = skema;
