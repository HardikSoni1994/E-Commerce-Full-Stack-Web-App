const express = require("express");
const { registerAdmin, loginAdmin } = require("../../../controllers/auth/admin/admin.controller");

const adminRoute = express.Router();

adminRoute.post("/register", registerAdmin);
adminRoute.post("/login", loginAdmin);

module.exports = adminRoute;
