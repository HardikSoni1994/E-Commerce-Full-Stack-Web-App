const express = require("express");
const { registerUser, loginUser, fetchAllUser, forgetPassword, verifyOTP, resetPassword } = require("../../../controllers/auth/user/user.controller");
const { userAuthMiddleware } = require("../../../middlewares/auth.middleware");

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);
userRoute.get("/fetchAllUser", userAuthMiddleware, fetchAllUser);
userRoute.post("/forget-password", forgetPassword);
userRoute.post("/verify-otp", verifyOTP);
userRoute.post("/reset-password", resetPassword);

module.exports = userRoute;
