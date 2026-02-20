const express = require("express");
const { registerUser, loginUser } = require("../../../controllers/auth/user/user.controller");

const userRoute = express.Router();

userRoute.post("/register", registerUser);
userRoute.post("/login", loginUser);

module.exports = userRoute;
