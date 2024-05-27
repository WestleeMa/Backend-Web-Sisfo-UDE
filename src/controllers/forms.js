const fs = require("fs");
const db = require("../connect.js");
const multer = require("multer");
const path = require("path");
const archiver = require("archiver");
const storage = require("../middleware/storageMiddleware");

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
      if (req.file)
        fs.unlinkSync(path.join(__dirname, "../../uploads", req.file.filename));
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
      if (req.file)
        fs.unlinkSync(path.join(__dirname, "../../uploads", req.file.filename));
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
      if (req.files) {
        const filesToDelete = Object.values(req.files)
          .flat()
          .map((file) => path.join(__dirname, "../../uploads", file.filename));
        filesToDelete.forEach((file) => {
          if (fs.existsSync(file)) {
            fs.unlinkSync(file);
          }
        });
      }
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
      if (req.file)
        fs.unlinkSync(path.join(__dirname, "../../uploads", req.file.filename));
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

//DELETE
//Pengajuan Judul dan Dosen Pembimbing Skripsi
async function delForm1(req, res) {
  upload.none()(req, res, function () {
    const { NIM } = req.body;
    deleteData("pengajuan_judul", NIM, "Draft_naskah");
    res.send(
      "Penghapusan data pada tabel Pengajuan Judul dan Dosen Pembimbing Skripsi berhasil"
    );
  });
}

//Pendaftaran Ujian Seminar of Thesis Proposal
async function delForm2(req, res) {
  upload.none()(req, res, function () {
    const { NIM } = req.body;
    deleteData("pendaftaran_thesis_proposal", NIM, "Bukti_approval");
    res.send(
      "Penghapusan data pada tabel Pendaftaran Ujian Seminar of Thesis Proposal berhasil"
    );
  });
}

//Pengumpulan File: Syarat Sidang Skripsi
async function delForm3(req, res) {
  upload.none()(req, res, function () {
    const { NIM } = req.body;
    const columnNames = [
      "File_Transkrip",
      "File_Bebas_plagiat",
      "File_Hasil_EPT",
      "File_Hasil_Turnitin_sempro",
      "File_bukti_lunas",
      "File_bukti_softskills",
      "File_Hasil_Turnitin_skripsi",
      "File_draft_artikel_jurnal",
      "File_Hasil_ITP",
      "Foto_Ijazah_SMA",
    ];
    deleteData("pengumpulan_file", NIM, columnNames);
    res.send(
      "Penghapusan data pada tabel Pengumpulan File: Syarat Sidang Skripsi berhasil"
    );
  });
}

//Pendaftaran Sidang Skripsi
async function delForm4(req, res) {
  upload.none()(req, res, function () {
    const { NIM } = req.body;
    deleteData("pendaftaran_sidang_skripsi", NIM, "Bukti_approval");
    res.send("Penghapusan data pada tabel Pendaftaran Sidang Skripsi berhasil");
  });
}

async function deleteData(table, NIM, fileColumn) {
  const filesToDelete = await collectFiles(table, NIM, fileColumn);
  const deleteFile = (fileName) => {
    const filePath = path.join(__dirname, "../../uploads", fileName);
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file ${fileName}: ${err}`);
      } else {
        console.log(`File ${fileName} deleted successfully`);
      }
    });
  };
  if (filesToDelete) {
    await db(table).where({ NIM }).del();
    filesToDelete.forEach(deleteFile);
  }
}

//READ
async function viewAllData(table) {
  return await db(table).first();
}

async function viewData(table, NIM) {
  return await db(table).where({ NIM }).first();
}

async function viewFormSubmission(req, res) {
  try {
    const formID = req.params.formID;
    const { NIM } = req.query;
    console.log(formID + " " + NIM);
    let formData;
    if (NIM && formID) {
      switch (formID) {
        case "1":
          formData = await viewData("pengajuan_judul", NIM);
          break;
        case "2":
          formData = await viewData("pendaftaran_thesis_proposal", NIM);
          break;
        case "3":
          formData = await viewData("pengumpulan_file", NIM);
          break;
        case "4":
          formData = await viewData("pendaftaran_sidang_skripsi", NIM);
          break;
        default:
          return res.status(400).send("Unknown formID:", formID);
      }
    } else if (formID) {
      switch (formID) {
        case "1":
          formData = await viewAllData("pengajuan_judul");
          break;
        case "2":
          formData = await viewAllData("pendaftaran_thesis_proposal");
          break;
        case "3":
          formData = await viewAllData("pengumpulan_file");
          break;
        case "4":
          formData = await viewAllData("pendaftaran_sidang_skripsi");
          break;
        default:
          return res.status(400).send("Unknown formID:", formID);
      }
    } else {
      return res.status(422).send("formID is required");
    }

    if (formData) {
      res.status(200).json({
        status: "success",
        data: [formData],
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "No Data Found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
}
async function collectFiles(table, NIM, fileColumn) {
  try {
    const result = await db(table).select(fileColumn).where({ NIM }).first();
    if (result) {
      return Object.values(result);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error collecting files:", error);
    throw error;
  }
}

async function downloadFiles(req, res) {
  const formID = req.params.formID;
  const { NIM } = req.query;
  let table;
  let fileColumn;

  if (NIM && formID) {
    switch (formID) {
      case "1":
        table = "pengajuan_judul";
        fileColumn = "Draft_naskah";
        break;
      case "2":
        table = "pendaftaran_thesis_proposal";
        fileColumn = "Bukti_approval";
        break;
      case "3":
        table = "pengumpulan_file";
        fileColumn = [
          "File_Transkrip",
          "File_Bebas_plagiat",
          "File_Hasil_EPT",
          "File_Hasil_Turnitin_sempro",
          "File_bukti_lunas",
          "File_bukti_softskills",
          "File_Hasil_Turnitin_skripsi",
          "File_draft_artikel_jurnal",
          "File_Hasil_ITP",
          "Foto_Ijazah_SMA",
        ];
        break;
      case "4":
        table = "pendaftaran_sidang_skripsi";
        fileColumn = "Bukti_approval";
        break;
      default:
        return res.status(400).send("Unknown formID:", formID);
    }
  } else {
    return res.status(400).send("formID and NIM is required");
  }

  try {
    const filenames = await collectFiles(table, NIM, fileColumn);
    const uploadDir = path.join(__dirname, "../../uploads");

    if (filenames.length === 1) {
      const singleFile = filenames[0];
      const filePath = path.join(uploadDir, singleFile);

      if (fs.existsSync(filePath)) {
        res.download(filePath, singleFile, (err) => {
          if (err) {
            console.error("Error downloading the file:", err);
            res.status(500).send("Error downloading the file");
          }
        });
      } else {
        res.status(404).send("File not found");
      }
    } else if (filenames.length > 1) {
      const zipFilename = `files-${NIM}.zip`;
      const zipFilePath = path.join(uploadDir, zipFilename);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => {
        res.download(zipFilePath, zipFilename, (err) => {
          if (err) {
            console.error("Error downloading the file:", err);
            res.status(500).send("Error downloading the file");
          }

          fs.unlink(zipFilePath, (err) => {
            if (err) {
              console.error("Error deleting the zip file:", err);
            }
          });
        });
      });

      archive.on("error", (err) => {
        throw err;
      });

      archive.pipe(output);

      filenames.forEach((filename) => {
        const filePath = path.join(uploadDir, filename);
        if (fs.existsSync(filePath)) {
          archive.file(filePath, { name: filename });
        } else {
          console.warn(`File not found: ${filename}`);
        }
      });

      archive.finalize();
    } else {
      res.status(404).send("No files found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
}

module.exports = {
  form1,
  form2,
  form3,
  form4,
  delForm1,
  delForm2,
  delForm3,
  delForm4,
  viewFormSubmission,
  downloadFiles,
};
