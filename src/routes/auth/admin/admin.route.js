const express = require("express");
const { registerAdmin, loginAdmin, fetchAllAdmin, deleteAdmin, updateAdminStatus, forgetPassword, verifyOTP, resetPassword } = require("../../../controllers/auth/admin/admin.controller");
const { adminAuthMiddleware} = require('../../../middlewares/auth.middleware');

const adminRoute = express.Router();

adminRoute.post("/register", registerAdmin);
adminRoute.post("/login", loginAdmin);
adminRoute.get("/fetchAllAdmin", adminAuthMiddleware, fetchAllAdmin);
adminRoute.delete('/', adminAuthMiddleware, deleteAdmin);
adminRoute.put('/update-status', adminAuthMiddleware, updateAdminStatus);
adminRoute.post("/forget-password", forgetPassword);
adminRoute.post("/verify-otp", verifyOTP);
adminRoute.post("/reset-password", resetPassword);

module.exports = adminRoute;