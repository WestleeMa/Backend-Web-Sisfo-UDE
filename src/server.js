const express = require("express");
const mysql = require("mysql");
const app = express();

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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.get("/", (req, res) => {
  console.log("test");
  res.json({ a: "a" });
});

const userRouter = require("./routes/infos");

app.use("/info", userRouter);

app.listen(5000);
