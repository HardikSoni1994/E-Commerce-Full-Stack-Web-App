const express = require("express");
const { registerAdmin, loginAdmin, fetchAllAdmin, deleteAdmin, updateAdminStatus, adminProfile, activeOrInActiveAdmin, changePassword, forgetPassword, verifyOTP, resetPassword } = require("../../../controllers/auth/admin/admin.controller");
const { adminAuthMiddleware} = require('../../../middlewares/auth.middleware');

const adminRoute = express.Router();

adminRoute.post("/register", registerAdmin);
adminRoute.post("/login", loginAdmin);
adminRoute.get("/fetchAllAdmin", adminAuthMiddleware, fetchAllAdmin);
adminRoute.delete('/', adminAuthMiddleware, deleteAdmin);
adminRoute.patch('/update-status', adminAuthMiddleware, updateAdminStatus);
adminRoute.get('/profile', adminAuthMiddleware, adminProfile);
adminRoute.put('/toggle-status', adminAuthMiddleware, activeOrInActiveAdmin);
adminRoute.put('/change-password', adminAuthMiddleware, changePassword);
adminRoute.post("/forget-password", forgetPassword);
adminRoute.post("/verify-otp", verifyOTP);
adminRoute.post("/reset-password", resetPassword);

module.exports = adminRoute;