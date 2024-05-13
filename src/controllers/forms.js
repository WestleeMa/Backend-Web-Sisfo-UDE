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
  upload.single("file")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).send("Multer error");
    } else if (err) {
      return res.status(500).send("Unknown error");
    }
    res.send("Masuk form 1 gan");
  });
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
