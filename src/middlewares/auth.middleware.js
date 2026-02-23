const jwt = require("jsonwebtoken");
const { MSG } = require("../utils/msg");
const { errorResponse } = require("../utils/response");
const statusCode = require("http-status-codes");
const AdminAuthServices = require("../services/auth/admin/admin.service");

const adminAuthService = new AdminAuthServices();

module.exports.authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    
    if (!token) {
      return res.status(statusCode.UNAUTHORIZED).json(errorResponse(statusCode.UNAUTHORIZED, true, MSG.TOKEN_MISSING));
    }

    token = token.slice(7, token.length);

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await adminAuthService.singleAdmin({ _id: decode.adminId });

    if (!admin) {
      return res.status(statusCode.UNAUTHORIZED).json(errorResponse(statusCode.UNAUTHORIZED, true, MSG.UNAUTHORIZED_ACCESS));
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.log("Middleware Error:", error);
    return res.status(statusCode.UNAUTHORIZED).json(errorResponse(statusCode.UNAUTHORIZED, true, MSG.TOKEN_INVALID));
  }
};