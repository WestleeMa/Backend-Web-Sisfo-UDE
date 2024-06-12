const db = require("../connect.js");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { privateKey } = require("../middleware/authMiddleware.js");
const storage = require("../middleware/storageMiddleware");
const upload = multer({ storage });

async function login(req, res) {
  try {
    upload.none()(req, res, async function () {
      const { NIM, password } = req.body;
      if (NIM && password) {
        const user = await db("users").where(`Nomor_Induk`, NIM).first();
        if (!user || !bcrypt.compareSync(password, user.Password)) {
          return res.status(401).send("Invalid NIM or password");
        }
        res.json(
          jwt.sign(
            {
              name: user.Name,
              role: user.Role,
              desc: user.Extra_Desc,
              Nomor_Induk: user.Nomor_Induk,
            },
            privateKey,
            { expiresIn: "2h" }
          )
        );
      } else {
        res.status(400).send("Uncomplete request");
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}

async function register(req, res) {
  try {
    await new Promise((resolve, reject) => {
      upload.single("Photo")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          reject(new Error("Multer error: " + err.message));
        } else if (err) {
          reject(new Error("Unknown error: " + err.message));
        } else {
          resolve();
        }
      });
    });
    const { Name, Extra_Desc, Role, Password, Nomor_Induk, email } = req.body;
    const Photo = req.file ? req.file.filename : null;
    if (!Name || !Extra_Desc || !Role || !Password || !Nomor_Induk || !email) {
      if (Photo) fs.unlinkSync(path.join(__dirname, "../../uploads", Photo));
      res.status(400).send("Please complete the registration form");
    } else {
      const checkUser = await db("users")
        .where("Nomor_Induk", Nomor_Induk)
        .first();

      if (checkUser) {
        if (Photo) fs.unlinkSync(path.join(__dirname, "../../uploads", Photo));
        res.status(409).send("User Already Exists");
      } else {
        bcrypt.hash(Password, 12, async function (err, hash) {
          if (err) {
            if (Photo)
              fs.unlinkSync(path.join(__dirname, "../../uploads", Photo));
            res.status(500).send("Error: " + err);
          } else {
            await db("users").insert({
              Name,
              Extra_Desc,
              Photo,
              Role,
              Password: hash,
              Nomor_Induk,
              email,
            });
            res.status(200).send("User Created Successfully");
          }
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

module.exports = { login, register };
