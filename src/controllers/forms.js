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

    const data = {
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
    };
    updateOrinsert("pengajuan_judul", data, NIM);
    res.send("Berhasil Submit Pengajuan Judul dan Dosen Pembimbing Skripsi");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

//Pendaftaran Ujian Seminar of Thesis Proposal
async function form2(req, res) {
  try {
    await new Promise((resolve, reject) => {
      upload.single("Bukti_approval")(req, res, function (err) {
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
      Skema_skripsi,
      Judul_skripsi,
      Judul_sebelum,
      Penguji1,
      Penguji2,
      Penguji3,
      PA,
      Link_google,
    } = req.body;

    if (
      !Nama ||
      !NIM ||
      !Bidang_kajian ||
      !Judul_skripsi ||
      !Penguji1 ||
      !Penguji2 ||
      !Penguji3 ||
      !Skema_skripsi ||
      !PA ||
      !Link_google ||
      !req.file
    ) {
      return res.status(400).send("Tolong lengkapi form.");
    }

    const Bukti_approval = req.file.filename;

    const data = {
      Nama,
      NIM,
      Bidang_kajian,
      Skema_skripsi,
      Judul_skripsi,
      Judul_sebelum,
      Penguji1,
      Penguji2,
      Penguji3,
      PA,
      Link_google,
      Bukti_approval,
    };
    updateOrinsert("pendaftaran_thesis_proposal", data, NIM);
    res.send("Berhasil Submit Pendaftaran Ujian Seminar of Thesis Proposal");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

//Pengumpulan File: Syarat Sidang Skripsi
async function form3(req, res) {
  try {
    await new Promise((resolve, reject) => {
      upload.fields([
        { name: "File_Transkrip", maxCount: 1 },
        { name: "File_Bebas_plagiat", maxCount: 1 },
        { name: "File_Hasil_EPT", maxCount: 1 },
        { name: "File_Hasil_Turnitin_sempro", maxCount: 1 },
        { name: "File_bukti_lunas", maxCount: 1 },
        { name: "File_bukti_softskills", maxCount: 1 },
        { name: "File_Hasil_Turnitin_skripsi", maxCount: 1 },
        { name: "File_draft_artikel_jurnal", maxCount: 1 },
        { name: "File_Hasil_ITP", maxCount: 1 },
        { name: "Foto_Ijazah_SMA", maxCount: 1 },
      ])(req, res, function (err) {
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
      Skor_EPT,
      Hasil_Turnitin_sempro,
      Hasil_Turnitin_skripsi,
      Hasil_ITP,
      Link_lembar_bimbingan,
    } = req.body;

    const {
      File_Transkrip,
      File_Bebas_plagiat,
      File_Hasil_EPT,
      File_Hasil_Turnitin_sempro,
      File_bukti_lunas,
      File_bukti_softskills,
      File_Hasil_Turnitin_skripsi,
      File_draft_artikel_jurnal,
      File_Hasil_ITP,
      Foto_Ijazah_SMA,
    } = req.files;

    if (!Nama || !NIM || !req.files) {
      return res.status(400).send("Tolong lengkapi form.");
    }

    const data = {
      Nama,
      NIM,
      Skor_EPT,
      Hasil_Turnitin_sempro,
      Hasil_Turnitin_skripsi,
      Hasil_ITP,
      Link_lembar_bimbingan,
      File_Transkrip: File_Transkrip[0].filename,
      File_Bebas_plagiat: File_Bebas_plagiat[0].filename,
      File_Hasil_EPT: File_Hasil_EPT[0].filename,
      File_Hasil_Turnitin_sempro: File_Hasil_Turnitin_sempro[0].filename,
      File_bukti_lunas: File_bukti_lunas[0].filename,
      File_bukti_softskills: File_bukti_softskills[0].filename,
      File_Hasil_Turnitin_skripsi: File_Hasil_Turnitin_skripsi[0].filename,
      File_draft_artikel_jurnal: File_draft_artikel_jurnal[0].filename,
      File_Hasil_ITP: File_Hasil_ITP[0].filename,
      Foto_Ijazah_SMA: Foto_Ijazah_SMA[0].filename,
    };
    updateOrinsert("pengumpulan_file", data, NIM);
    res.send("Berhasil Submit Pengumpulan File: Syarat Sidang Skripsi");
    // res.sendFile(
    //   path.resolve(__dirname, "../../uploads", File_Transkrip[0].filename)
    // );
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

//Pendaftaran Sidang Skripsi
async function form4(req, res) {
  try {
    await new Promise((resolve, reject) => {
      upload.single("Bukti_approval")(req, res, function (err) {
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
      Skema_skripsi,
      Penguji1,
      Penguji2,
      Penguji3,
      PA,
      Link_Google_docs,
      Link_Video_presentasi,
    } = req.body;

    if (
      !Nama ||
      !NIM ||
      !Bidang_kajian ||
      !Penguji1 ||
      !Penguji2 ||
      !Penguji3 ||
      !Skema_skripsi ||
      !PA ||
      !Link_Google_docs ||
      !Link_Video_presentasi ||
      !req.file
    ) {
      return res.status(400).send("Tolong lengkapi form.");
    }

    const Bukti_approval = req.file.filename;

    const data = {
      Nama,
      NIM,
      Bidang_kajian,
      Skema_skripsi,
      Penguji1,
      Penguji2,
      Penguji3,
      PA,
      Link_Google_docs,
      Link_Video_presentasi,
      Bukti_approval,
    };
    updateOrinsert("pendaftaran_sidang_skripsi", data, NIM);
    res.send("Berhasil Submit Pendaftaran Sidang Skripsi");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

async function updateOrinsert(table, data, NIM) {
  const existingRecord = await db(table).where({ NIM }).first();

  if (existingRecord) {
    await db(table).where({ NIM }).update(data);
  } else {
    await db(table).insert(data);
  }
}
module.exports = { form1, form2, form3, form4 };
