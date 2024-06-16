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
    let mimeType;
    let extname;
    let Photo;
    if (req.file) {
      const fileTypes = /jpeg|jpg|png/;
      mimeType = fileTypes.test(req.file?.mimetype);
      extname = fileTypes.test(
        path.extname(req.file?.originalname).toLowerCase()
      );
      Photo = req.file?.filename;
    }
    if (!Name || !Role || !Password || !Nomor_Induk || !email) {
      if (Photo) fs.unlinkSync(path.join(__dirname, "../../uploads", Photo));
      res.status(400).send("Please complete the registration form");
    } else if (req.file && !mimeType && !extname) {
      fs.unlinkSync(path.join(__dirname, "../../uploads", Photo));
      return res.status(400).send("Hanya diperbolehkan .jpg, .jpeg, .png");
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
              Photo: Photo,
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

async function userChangePass(req, res) {
  try {
    const { oldPass, newPass, Nomor_Induk } = req.body;
    if (oldPass && newPass && Nomor_Induk) {
      const checkUser = await db("users")
        .where("Nomor_Induk", Nomor_Induk)
        .first();
      if (checkUser) {
        const checkOldPass = bcrypt.compareSync(oldPass, checkUser.Password);
        if (checkOldPass) {
          bcrypt.hash(newPass, 12, async function (err, hash) {
            if (err) {
              res.status(500).send(err);
            } else {
              await db("users").where({ Nomor_Induk }).update({
                Password: hash,
              });
              res.status(200).send("Password Updated Successfully");
            }
          });
        } else {
          res.status(400).send("Invalid Old Password");
        }
      } else {
        res.status(404).send("User Doesn't Exists");
      }
    } else {
      res.status(400).send("Please complete the form");
    }
  } catch (err) {
    console.error(err);
  }
}

async function updateUser(req, res) {
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
    let mimeType;
    let extname;
    let Photo;
    if (req.file) {
      const fileTypes = /jpeg|jpg|png/;
      mimeType = fileTypes.test(req.file?.mimetype);
      extname = fileTypes.test(
        path.extname(req.file?.originalname).toLowerCase()
      );
      Photo = req.file?.filename;
    }

    if (!Nomor_Induk) {
      res.status(400).send("Nomor Induk?");
    } else if (req.file && !mimeType && !extname) {
      fs.unlinkSync(path.join(__dirname, "../../uploads", Photo));
      return res.status(400).send("Hanya diperbolehkan .jpg, .jpeg, .png");
    } else {
      const checkUser = await db("users")
        .where("Nomor_Induk", Nomor_Induk)
        .first();
      if (checkUser) {
        if (Password) {
          bcrypt.hash(Password, 12, async function (err, hash) {
            if (err) {
              if (Photo)
                fs.unlinkSync(path.join(__dirname, "../../uploads", Photo));
              res.status(500).send("Error: " + err);
            } else {
              if (Photo) {
                if (checkUser.Photo)
                  fs.unlinkSync(
                    path.join(__dirname, "../../uploads", checkUser.Photo)
                  );
              }
              await db("users").where({ Nomor_Induk }).update({
                Name,
                Extra_Desc,
                Photo,
                Role,
                Password: hash,
                email,
              });
              res.status(200).send("User Updated Successfully");
            }
          });
        } else {
          if (Photo)
            fs.unlinkSync(
              path.join(__dirname, "../../uploads", checkUser.Photo)
            );
          await db("users").where({ Nomor_Induk }).update({
            Name,
            Extra_Desc,
            Photo,
            Role,
            email,
          });
          res.status(200).send("User Details Updated Successfully");
        }
      } else {
        res.status(404).send("User Doesn't Exists");
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteUser(req, res) {
  try {
    const Nomor_Induk = req.query.Nomor_Induk;
    if (Nomor_Induk) {
      const checkUser = await db("users")
        .where("Nomor_Induk", Nomor_Induk)
        .first();
      if (checkUser) {
        const fileToDelete = await db("users")
          .select("Photo")
          .where({ Nomor_Induk })
          .first();

        const deleteFile = (fileName) => {
          if (fileName) {
            const filePath = path.join(__dirname, "../../uploads", fileName);
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`Error deleting file ${fileName}: ${err}`);
                throw err;
              } else {
                return `File ${fileName} deleted successfully`;
              }
            });
          }
        };

        if (fileToDelete) {
          await db("users").where({ Nomor_Induk }).del();
          deleteFile(fileToDelete.Photo);
          res.send("Penghapusan User berhasil");
        }
      } else {
        res.status(404).send("User Doesn't Exists");
      }
    } else {
      res.status(400).send("Nomor Induk?");
    }
  } catch (err) {
    throw err;
  }
}

async function userPhoto(req, res) {
  try {
    const Nomor_Induk = req.query.Nomor_Induk;
    if (Nomor_Induk) {
      const checkUser = await db("users")
        .where("Nomor_Induk", Nomor_Induk)
        .first();
      if (checkUser) {
        const imageName = await db("users")
          .select("Photo")
          .where({ Nomor_Induk });
        let filePath;
        if (imageName[0].Photo) {
          filePath = path.join(__dirname, "../../uploads/", imageName[0].Photo);
        } else {
          filePath = path.join(__dirname, "../../uploads/4537019.png");
        }
        res.sendFile(filePath);
      } else {
        res.status(404).send("User Doesn't Exists");
      }
    } else {
      res.status(400).send("Nomor Induk?");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function viewUser(req, res) {
  try {
    const Nomor_Induk = req.query.Nomor_Induk;
    if (Nomor_Induk) {
      const checkUser = await db("users")
        .where("Nomor_Induk", Nomor_Induk)
        .first();
      if (checkUser) {
        const data = await db("users")
          .select("Name", "Extra_Desc", "Role", "Nomor_Induk", "email")
          .where({ Nomor_Induk });
        res.send(data);
      } else {
        res.status(400).send("User Doesn't Exists");
      }
    } else {
      const data = await db("users");
      res.send(data);
    }
  } catch (err) {
    console.error(err);
    res.status(400);
  }
}

module.exports = {
  login,
  register,
  updateUser,
  deleteUser,
  viewUser,
  userPhoto,
  userChangePass,
};
