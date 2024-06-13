const db = require("../connect.js");
const path = require("path");
const multer = require("multer");
const storage = require("../middleware/storageMiddleware");
const fs = require("fs");

async function info(req, res) {
  const resQuery = await db("infos");
  res.status(200).json({ status: "success", data: resQuery });
}

async function infoImage(req, res) {
  try {
    const infoID = req.query.Info_ID;
    if (infoID) {
      const imageName = await db("infos")
        .select("Photos")
        .where({ Info_ID: infoID });
      let filePath;
      if (imageName[0].Photos) {
        filePath = path.join(__dirname, "../../uploads/", imageName[0].Photos);
      } else {
        filePath = path.join(__dirname, "../../uploads/no-image-icon.png");
      }
      res.sendFile(filePath);
    } else {
      res.status(400).send("Missing infoID");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const upload = multer({
  storage,
});

async function delInfo(req, res) {
  try {
    const Info_ID = req.query.Info_ID;
    const fileToDelete = await db("infos")
      .select("Photos")
      .where({ Info_ID })
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
      await db("infos").where({ Info_ID }).del();
      deleteFile(fileToDelete.Photos);
      res.send("Penghapusan info berhasil");
    }
  } catch (err) {
    throw err;
  }
}

async function addOrEditInfo(req, res) {
  try {
    await new Promise((resolve, reject) => {
      upload.single("Photos")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          reject(new Error("Multer error: " + err.message));
        } else if (err) {
          reject(new Error("Unknown error: " + err.message));
        } else {
          resolve();
        }
      });
    });

    const { Title, Description, Info_ID, aoe } = req.body;
    let mimeType;
    let extname;
    let Photos;
    if (req.file) {
      const fileTypes = /jpeg|jpg|png/;
      mimeType = fileTypes.test(req.file?.mimetype);
      extname = fileTypes.test(
        path.extname(req.file?.originalname).toLowerCase()
      );
      Photos = req.file?.filename;
    }

    if ((!Title && aoe === "Add") || (!Description && aoe === "Add")) {
      if (req.file)
        fs.unlinkSync(path.join(__dirname, "../../uploads", Photos));
      return res.status(400).send("Tolong lengkapi form.");
    } else if (req.file && !mimeType && !extname) {
      fs.unlinkSync(path.join(__dirname, "../../uploads", Photos));
      return res.status(400).send("Hanya diperbolehkan .jpg, .jpeg, .png");
    }

    const data = {
      Title,
      Description,
      Photos,
    };

    if (aoe === "Add") {
      updateOrinsert("infos", data);
      res.send("Berhasil Menambahkan Informasi");
    } else if (aoe === "Edit") {
      if (Info_ID) {
        updateOrinsert("infos", data, Info_ID);
        res.send("Berhasil Memperbarui Informasi");
      } else {
        res.send("Info ID?");
      }
    } else {
      res.status(400).send("add or edit?");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function updateOrinsert(table, data, Info_ID) {
  try {
    if (Info_ID) {
      const existingRecord = await db(table).where({ Info_ID }).first();
      if (existingRecord) {
        await db(table).where({ Info_ID }).update(data);
      } else {
        await db(table).insert(data);
      }
    } else {
      await db(table).insert(data);
    }
  } catch (error) {
    throw error;
  }
}
module.exports = { info, infoImage, addOrEditInfo, delInfo };
