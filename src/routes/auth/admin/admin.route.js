const express = require("express");
const { registerAdmin, loginAdmin, fetchAllAdmin } = require("../../../controllers/auth/admin/admin.controller");
const { authMiddleware} = require('../../../middlewares/auth.middleware');

const adminRoute = express.Router();

adminRoute.post("/register", registerAdmin);
adminRoute.post("/login", loginAdmin);
adminRoute.get("/fetchAllAdmin", fetchAllAdmin);

module.exports = adminRoute;