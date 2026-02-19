require("dotenv").config();
const express = require("express");
const db = require("./config/db.config");
const app = express();

const PORT = 3000;

app.use("/", (req, res) => {
  res.send(
    "<h2>Hello, E-commerce Website is started to build ful-stack functionality real-world web-app.😎😎</h2> ",
  );
});

app.listen(PORT, (error) => {
  if (error) {
    console.log("Server does not Started.!", error);
    return false;
  }
  console.log("Server is Started at localhost:", PORT);
});
