const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.json());
app.get("/", (req, res) => {
  console.log("test");
  res.json({ halo: "Selamat datang" });
});

const Router = require("./routes/route");
const formRouter = require("./routes/formroute");
const infoRouter = require("./routes/inforoute");

app.use("/", Router);
app.use("/form", formRouter);
app.use("/info", infoRouter);

app.listen(5000);
