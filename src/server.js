const express = require("express");
const app = express();

app.get("/", (req, res) => {
  console.log("test");
  res.json({ a: "a" });
});

const userRouter = require("./routes/infos");

app.use("/info", userRouter);

app.listen(5000);
