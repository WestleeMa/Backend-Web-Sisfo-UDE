const db = require("../connect.js");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});
const upload = multer({ storage });

//Pengajuan Judul dan Dosen Pembimbing Skripsi
async function form1(req, res) {
  try {
    await new Promise((resolve, reject) => {
      upload.single("Draft_naskah")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          reject(new Error("Multer error: " + err.message));
        } else if (err) {
          reject(new Error("Unknown error: " + err.message));
        } else {
          resolve();
        }
      });
    });

    const {
      Nama,
      NIM,
      Bidang_kajian,
      Judul_skripsi,
      Judul_sebelum,
      Dospem_sebelum,
      Dospem1,
      Dospem2,
      Skema_skripsi,
    } = req.body;

    if (
      !Nama ||
      !NIM ||
      !Bidang_kajian ||
      !Judul_skripsi ||
      !Dospem1 ||
      !Dospem2 ||
      !Skema_skripsi ||
      !req.file
    ) {
      return res.status(400).send("Tolong lengkapi form.");
    }

    const Draft_naskah = req.file.filename;

    await db("pengajuan_judul").insert({
      Nama,
      NIM,
      Bidang_kajian,
      Judul_skripsi,
      Judul_sebelum,
      Dospem_sebelum,
      Dospem1,
      Dospem2,
      Skema_skripsi,
      Draft_naskah,
    });

    res.send("Form Pengajuan Judul Berhasil Terkirim");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

//Pendaftaran Ujian Seminar of Thesis Proposal
async function form2(req, res) {
  res.send("Masuk form 2 gan");
}

//Pengumpulan File: Syarat Sidang Skripsi
async function form3(req, res) {
  res.send("Masuk form 3 gan");
}

//Pendaftaran Sidang Skripsi
async function form4(req, res) {
  res.send("Masuk form 4 gan");
}

module.exports = { form1, form2, form3, form4 };
