const db = require("../connect.js");

async function links(req, res) {
  const resQuery = await db("links");
  res.send(resQuery);
}

module.exports = links;
