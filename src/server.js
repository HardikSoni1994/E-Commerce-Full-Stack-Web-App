require("dotenv").config();
const express = require("express");
const db = require("./config/db.config");
const app = express();
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT;

app.use(express.urlencoded());
app.use(express.json());

// app.use("/", (req, res) => {
//   res.send();
// });

// routes
app.use("/api", require("./routes"));

app.listen(PORT, (error) => {
  if (error) {
    console.log("Server does not Started.!", error);
    return false;
  }
  console.log("Server is Started at localhost:", PORT);
});
