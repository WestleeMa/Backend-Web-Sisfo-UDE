const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_sisfo_ude",
});

db.connect((err) => {
  if (err) {
    throw err;
  } else {
    console.log("Connected Sucessfully");
  }
});

module.exports = db;
