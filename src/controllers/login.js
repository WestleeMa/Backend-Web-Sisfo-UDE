const db = require("../connect.js");
const bcrypt = require("bcryptjs");

async function login(req, res) {
  const { NIM, password } = req.body;
  console.log(req.body);
  try {
    const user = await db("users").where(`Nomor_Induk`, NIM).first();
    if (!user || !bcrypt.compareSync(password, user.Password)) {
      return res.status(401).send("Invalid NIM or password");
    }
    res.json({ name: user.Name, role: user.Role, desc: user.Extra_Desc });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

module.exports = login;
