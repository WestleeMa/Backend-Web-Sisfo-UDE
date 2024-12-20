const fs = require("fs");
const db = require("../connect.js");
const multer = require("multer");
const path = require("path");
const archiver = require("archiver");
const storage = require("../middleware/storageMiddleware");

const upload = multer({ storage });

async function approval_dosen(req, res) {
  try {
    const { NIM, formID, approval } = req.body;
    if (NIM && formID && approval) {
      let tableName;
      if (formID === 1) {
        tableName = "pengajuan_judul";
      } else if (formID === 2) {
        tableName = "pendaftaran_thesis_proposal";
      } else if (formID === 4) {
        tableName = "pendaftaran_sidang_skripsi";
      } else {
        res.status(400).send("Wrong Id" + formID);
      }
      if (tableName) {
        const {
          approval_dosen1,
          approval_dosen2,
          approval_dosen3,
          approval_dosen4,
          form_approval,
        } = approval;

        const dbresponse = await updateOrinsert(
          tableName,
          {
            approval_dosen1,
            approval_dosen2,
            approval_dosen3,
            approval_dosen4,
            form_approval,
          },
          NIM
        );
        if (dbresponse === 1) {
          res.send("Updated");
        } else {
          res.send("Failed to update, check the id or approval column names");
        }
      }
    } else {
      res
        .status(400)
        .send("Incomplete Request (no NIM or formID or Approval Status)");
    }
  } catch (error) {
    console.error(error);
  }
}
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
      NIM,
      Bidang_kajian,
      Judul_skripsi,
      Judul_sebelum,
      Dospem_sebelum,
      Dospem1,
      Dospem2,
      Skema_skripsi,
    } = req.body;

    let mimeType;
    let extname;

    if (req.file) {
      const fileTypes = /docx|doc/;
      mimeType = fileTypes.test(req.file?.mimetype);
      extname = fileTypes.test(
        path.extname(req.file?.originalname).toLowerCase()
      );
    }
    if (
      !NIM ||
      !Bidang_kajian ||
      !Judul_skripsi ||
      !Dospem1 ||
      !Dospem2 ||
      !Skema_skripsi ||
      !req.file
    ) {
      console.log(req.body);
      if (req.file)
        fs.unlinkSync(path.join(__dirname, "../../uploads", req.file.filename));
      res.status(400).send("Tolong lengkapi form.");
    } else if (!mimeType && !extname) {
      if (req.file)
        fs.unlinkSync(path.join(__dirname, "../../uploads", req.file.filename));
      res.status(400).send("Draft Naskah harus berformat .docx atau .doc");
    } else {
      const Draft_naskah = req.file?.filename;
      const data = {
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

      const dbresponse = await updateOrinsert("pengajuan_judul", data, NIM);
      if (dbresponse === 1) {
        res.send(
          "Berhasil Submit Pengajuan Judul dan Dosen Pembimbing Skripsi"
        );
      } else {
        if (req.file)
          fs.unlinkSync(
            path.join(__dirname, "../../uploads", req.file.filename)
          );
        res.status(400).send("Invalid Data");
      }
    }
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

    let mimeType;
    let extname;

    if (req.file) {
      const fileTypes = /pdf|jpg|jpeg|png/;
      mimeType = fileTypes.test(req.file?.mimetype);
      extname = fileTypes.test(
        path.extname(req.file?.originalname).toLowerCase()
      );
    }
    if (
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
      res.status(400).send("Tolong lengkapi form.");
    } else if (!mimeType && !extname) {
      if (req.file)
        fs.unlinkSync(path.join(__dirname, "../../uploads", req.file.filename));
      res
        .status(400)
        .send("Bukti Approval hanya dibolehkan .pdf, .jpg, .jpeg, dan .png");
    } else {
      const Bukti_approval = req.file.filename;

      const data = {
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
      const dbresponse = await updateOrinsert(
        "pendaftaran_thesis_proposal",
        data,
        NIM
      );
      if (dbresponse === 1) {
        res.send(
          "Berhasil Submit Pendaftaran Ujian Seminar of Thesis Proposal"
        );
      } else {
        if (req.file)
          fs.unlinkSync(
            path.join(__dirname, "../../uploads", req.file.filename)
          );
        res.status(400).send("Invalid Data");
      }
    }
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
      NIM,
      Skor_EPT,
      Hasil_Turnitin_sempro,
      Hasil_Turnitin_skripsi,
      Hasil_ITP,
      Link_lembar_bimbingan,
    } = req.body;

    if (!NIM) {
      return res.status(400).send("Tolong lengkapi form.");
    }

    const files = {
      File_Transkrip: req.files?.File_Transkrip?.[0]?.filename,
      File_Bebas_plagiat: req.files?.File_Bebas_plagiat?.[0]?.filename,
      File_Hasil_EPT: req.files?.File_Hasil_EPT?.[0]?.filename,
      File_Hasil_Turnitin_sempro:
        req.files?.File_Hasil_Turnitin_sempro?.[0]?.filename,
      File_bukti_lunas: req.files?.File_bukti_lunas?.[0]?.filename,
      File_bukti_softskills: req.files?.File_bukti_softskills?.[0]?.filename,
      File_Hasil_Turnitin_skripsi:
        req.files?.File_Hasil_Turnitin_skripsi?.[0]?.filename,
      File_draft_artikel_jurnal:
        req.files?.File_draft_artikel_jurnal?.[0]?.filename,
      File_Hasil_ITP: req.files?.File_Hasil_ITP?.[0]?.filename,
      Foto_Ijazah_SMA: req.files?.Foto_Ijazah_SMA?.[0]?.filename,
    };

    const data = {
      NIM,
      Skor_EPT,
      Hasil_Turnitin_sempro,
      Hasil_Turnitin_skripsi,
      Hasil_ITP,
      Link_lembar_bimbingan,
      ...files,
    };

    const dbresponse = await updateOrinsert("pengumpulan_file", data, NIM);
    if (dbresponse === 1) {
      res.send("Berhasil Submit Pengumpulan File: Syarat Sidang Skripsi");
    } else {
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
      res.status(400).send("Invalid Data");
    }
  } catch (error) {
    console.error(error);
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
      NIM,
      Judul_skripsi,
      Bidang_kajian,
      Skema_skripsi,
      Penguji1,
      Penguji2,
      Penguji3,
      PA,
      Link_Google_docs,
      Link_Video_presentasi,
    } = req.body;

    let mimeType;
    let extname;

    if (req.file) {
      const fileTypes = /pdf|jpg|jpeg|png/;
      mimeType = fileTypes.test(req.file?.mimetype);
      extname = fileTypes.test(
        path.extname(req.file?.originalname).toLowerCase()
      );
    }

    if (
      !NIM ||
      !Judul_skripsi ||
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
    } else if (!mimeType && !extname) {
      if (req.file)
        fs.unlinkSync(path.join(__dirname, "../../uploads", req.file.filename));
      res
        .status(400)
        .send("Bukti Approval hanya dibolehkan .pdf, .jpg, .jpeg, dan .png");
    } else {
      const Bukti_approval = req.file.filename;

      const data = {
        NIM,
        Judul_skripsi,
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
      const dbresponse = await updateOrinsert(
        "pendaftaran_sidang_skripsi",
        data,
        NIM
      );
      if (dbresponse === 1) {
        res.send("Berhasil Submit Pendaftaran Sidang Skripsi");
      } else {
        if (req.file)
          fs.unlinkSync(
            path.join(__dirname, "../../uploads", req.file.filename)
          );
        res.status(400).send("Invalid Data");
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

async function updateOrinsert(table, data, NIM) {
  try {
    const existingRecord = await db(table).where({ NIM }).first();

    if (existingRecord) {
      if (data.Draft_naskah) {
        if (existingRecord.Draft_naskah)
          fs.unlinkSync(
            path.join(__dirname, "../../uploads", existingRecord.Draft_naskah)
          );
      } else if (data.Bukti_approval) {
        if (existingRecord.Bukti_approval)
          fs.unlinkSync(
            path.join(__dirname, "../../uploads", existingRecord.Bukti_approval)
          );
      }
      await db(table).where({ NIM }).update(data);
    } else {
      await db(table).insert(data);
    }
    return 1;
  } catch (err) {
    return err;
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
  if (filesToDelete) {
    await db(table).where({ NIM }).del();
    filesToDelete.forEach(deleteFile);
  }
}

//READ

async function viewFormSubmission(req, res) {
  try {
    const formID = req.params.formID;
    const { NIM } = req.query;
    let formData;
    if (NIM && formID) {
      switch (formID) {
        case "1":
          formData = await db("pengajuan_judul as s")
            .select(
              "s.Submission_ID",
              "u.Name as Nama",
              "s.NIM",
              "bk.descr as Bidang_kajian",
              "ss.descr as Skema_skripsi",
              "s.Judul_skripsi",
              "s.Judul_sebelum",
              "s.form_approval",
              "s.Dospem_sebelum",
              "d1.Nama as Dospem1",
              "d2.Nama as Dospem2",
              "s.approval_dosen1",
              "s.approval_dosen2",
              "s.Draft_naskah",
              "s.Timestamps"
            )
            .leftJoin({ bk: "bidang_kajian" }, "s.Bidang_kajian", "bk.id")
            .leftJoin({ ss: "skema_skripsi" }, "s.Skema_skripsi", "ss.id")
            .leftJoin({ d1: "dosen_pembimbing" }, "s.Dospem1", "d1.key_dosen")
            .leftJoin({ d2: "dosen_pembimbing" }, "s.Dospem2", "d2.key_dosen")
            .leftJoin({ u: "users" }, "s.NIM", "u.Nomor_Induk")
            .where({ NIM })
            .first();
          break;
        case "2":
          formData = await db("pendaftaran_thesis_proposal as s")
            .select(
              "s.Submission_ID",
              "u.Name as Nama",
              "s.NIM",
              "bk.descr as Bidang_kajian",
              "ss.descr as Skema_skripsi",
              "s.Judul_skripsi",
              "s.Judul_sebelum",
              "p1.nama as Penguji1",
              "p2.nama as Penguji2",
              "p3.nama as Penguji3",
              "s.approval_dosen1",
              "s.approval_dosen2",
              "s.approval_dosen3",
              "s.approval_dosen4",
              "s.form_approval",
              "pa.nama as PA",
              "s.Bukti_approval",
              "s.Timestamps",
              "s.Link_google"
            )
            .leftJoin({ bk: "bidang_kajian" }, "s.Bidang_kajian", "bk.id")
            .leftJoin({ ss: "skema_skripsi" }, "s.Skema_skripsi", "ss.id")
            .leftJoin({ p1: "dosen_pembimbing" }, "s.Penguji1", "p1.key_dosen")
            .leftJoin({ p2: "dosen_pembimbing" }, "s.Penguji2", "p2.key_dosen")
            .leftJoin({ p3: "dosen_pembimbing" }, "s.Penguji3", "p3.key_dosen")
            .leftJoin({ pa: "dosen_pembimbing" }, "s.PA", "pa.key_dosen")
            .leftJoin({ u: "users" }, "s.NIM", "u.Nomor_Induk")
            .where({ NIM })
            .first();
          break;
        case "3":
          formData = await db("pengumpulan_file as s")
            .select(
              "s.Submission_ID",
              "u.Name as Nama",
              "s.NIM",
              "s.Skor_EPT",
              "s.Hasil_Turnitin_sempro",
              "s.Hasil_Turnitin_skripsi",
              "s.Hasil_ITP",
              "s.Link_lembar_bimbingan",
              "s.Timestamps"
            )
            .leftJoin({ u: "users" }, "s.NIM", "u.Nomor_Induk")
            .where({ NIM })
            .first();
          break;
        case "4":
          formData = await db("pendaftaran_sidang_skripsi as s")
            .select(
              "s.Submission_ID",
              "u.Name as Nama",
              "s.NIM",
              "bk.descr as Bidang_kajian",
              "ss.descr as Skema_skripsi",
              "p1.nama as Penguji1",
              "p2.nama as Penguji2",
              "p3.nama as Penguji3",
              "pa.nama as PA",
              "s.approval_dosen1",
              "s.approval_dosen2",
              "s.approval_dosen3",
              "s.approval_dosen4",
              "s.form_approval",
              "s.Bukti_approval",
              "s.Link_Google_docs",
              "s.Link_Video_presentasi",
              "s.Timestamps"
            )
            .leftJoin({ bk: "bidang_kajian" }, "s.Bidang_kajian", "bk.id")
            .leftJoin({ ss: "skema_skripsi" }, "s.Skema_skripsi", "ss.id")
            .leftJoin({ p1: "dosen_pembimbing" }, "s.Penguji1", "p1.key_dosen")
            .leftJoin({ p2: "dosen_pembimbing" }, "s.Penguji2", "p2.key_dosen")
            .leftJoin({ p3: "dosen_pembimbing" }, "s.Penguji3", "p3.key_dosen")
            .leftJoin({ pa: "dosen_pembimbing" }, "s.PA", "pa.key_dosen")
            .leftJoin({ u: "users" }, "s.NIM", "u.Nomor_Induk")
            .where({ NIM })
            .first();
          break;
        default:
          return res.status(400).send("Unknown formID:", formID);
      }
    } else if (formID) {
      switch (formID) {
        case "1":
          formData = await db("pengajuan_judul as s")
            .select(
              "s.Submission_ID",
              "u.Name as Nama",
              "s.NIM",
              "bk.descr as Bidang_kajian",
              "ss.descr as Skema_skripsi",
              "s.Judul_skripsi",
              "s.Judul_sebelum",
              "s.Dospem_sebelum",
              "s.approval_dosen1",
              "s.form_approval",
              "s.approval_dosen2",
              "d1.Nama as Dospem1",
              "d2.Nama as Dospem2",
              "s.Draft_naskah",
              "s.Timestamps"
            )
            .leftJoin({ bk: "bidang_kajian" }, "s.Bidang_kajian", "bk.id")
            .leftJoin({ ss: "skema_skripsi" }, "s.Skema_skripsi", "ss.id")
            .leftJoin({ d1: "dosen_pembimbing" }, "s.Dospem1", "d1.key_dosen")
            .leftJoin({ d2: "dosen_pembimbing" }, "s.Dospem2", "d2.key_dosen")
            .leftJoin({ u: "users" }, "s.NIM", "u.Nomor_Induk");
          break;
        case "2":
          formData = await db("pendaftaran_thesis_proposal as s")
            .select(
              "s.Submission_ID",
              "u.Name as Nama",
              "s.NIM",
              "bk.descr as Bidang_kajian",
              "ss.descr as Skema_skripsi",
              "s.Judul_skripsi",
              "s.Judul_sebelum",
              "p1.nama as Penguji1",
              "p2.nama as Penguji2",
              "p3.nama as Penguji3",
              "pa.nama as PA",
              "s.approval_dosen1",
              "s.approval_dosen2",
              "s.approval_dosen3",
              "s.approval_dosen4",
              "s.form_approval",
              "s.Bukti_approval",
              "s.Timestamps",
              "s.Link_google"
            )
            .leftJoin({ bk: "bidang_kajian" }, "s.Bidang_kajian", "bk.id")
            .leftJoin({ ss: "skema_skripsi" }, "s.Skema_skripsi", "ss.id")
            .leftJoin({ p1: "dosen_pembimbing" }, "s.Penguji1", "p1.key_dosen")
            .leftJoin({ p2: "dosen_pembimbing" }, "s.Penguji2", "p2.key_dosen")
            .leftJoin({ p3: "dosen_pembimbing" }, "s.Penguji3", "p3.key_dosen")
            .leftJoin({ pa: "dosen_pembimbing" }, "s.PA", "pa.key_dosen")
            .leftJoin({ u: "users" }, "s.NIM", "u.Nomor_Induk");
          break;
        case "3":
          formData = await db("pengumpulan_file as s")
            .select(
              "s.Submission_ID",
              "u.Name as Nama",
              "s.NIM",
              "s.Skor_EPT",
              "s.Hasil_Turnitin_sempro",
              "s.Hasil_Turnitin_skripsi",
              "s.Hasil_ITP",
              "s.Link_lembar_bimbingan",
              "s.Timestamps"
            )
            .leftJoin({ u: "users" }, "s.NIM", "u.Nomor_Induk");
          break;
        case "4":
          formData = await db("pendaftaran_sidang_skripsi as s")
            .select(
              "s.Submission_ID",
              "u.Name as Nama",
              "s.NIM",
              "bk.descr as Bidang_kajian",
              "ss.descr as Skema_skripsi",
              "p1.nama as Penguji1",
              "p2.nama as Penguji2",
              "p3.nama as Penguji3",
              "pa.nama as PA",
              "s.approval_dosen1",
              "s.approval_dosen2",
              "s.approval_dosen3",
              "s.approval_dosen4",
              "s.form_approval",
              "s.Bukti_approval",
              "s.Link_Google_docs",
              "s.Link_Video_presentasi",
              "s.Timestamps"
            )
            .leftJoin({ bk: "bidang_kajian" }, "s.Bidang_kajian", "bk.id")
            .leftJoin({ ss: "skema_skripsi" }, "s.Skema_skripsi", "ss.id")
            .leftJoin({ p1: "dosen_pembimbing" }, "s.Penguji1", "p1.key_dosen")
            .leftJoin({ p2: "dosen_pembimbing" }, "s.Penguji2", "p2.key_dosen")
            .leftJoin({ p3: "dosen_pembimbing" }, "s.Penguji3", "p3.key_dosen")
            .leftJoin({ pa: "dosen_pembimbing" }, "s.PA", "pa.key_dosen")
            .leftJoin({ u: "users" }, "s.NIM", "u.Nomor_Induk");
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
  approval_dosen,
};
