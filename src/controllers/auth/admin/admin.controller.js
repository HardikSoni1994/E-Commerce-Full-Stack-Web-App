const AdminAuthServices = require("../../../services/auth/admin/admin.service");
const { MSG } = require("../../../utils/msg");
const { errorResponse, successResponse } = require("../../../utils/response");
const statusCode = require('http-status-codes');
const moment = require("moment");
const bcrypt = require("bcryptjs");

const adminAuthService = new AdminAuthServices();

module.exports.registerAdmin = async (req, res) => {
  try {
    console.log(req.body);
    console.log("=== Register Admin successfully ===");

    req.body.password = await bcrypt.hash(String(req.body.password), 10);

    req.body.create_at = moment().format("DD/MM/YYYY, hh:mm:ss a");
    req.body.update_at = moment().format("DD/MM/YYYY, hh:mm:ss a");

    const newAdmin = await adminAuthService.registerAdmin(req.body);

    if (!newAdmin) {
      return res.status(statusCode.BAD_REQUEST).json(errorResponse(statusCode.BAD_REQUEST, true, MSG.ADMIN_REGISTRATION_FAILED));
    }
    return res.status(statusCode.CREATED).json(successResponse(statusCode.CREATED, false, MSG.ADMIN_REGISTRATION_SUCCESS, newAdmin),
      );
  } catch (error) {
    console.log("Error :", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.INTERNAL_SERVER_ERROR));
  }
};

module.exports.loginAdmin = async (req, res) => {
  try {
    const admin = await adminAuthService.singleAdmin({email: req.body.email});
    
    if (!admin) {
      return res.status(statusCode.NOT_FOUND).json(errorResponse(statusCode.NOT_FOUND, true, MSG.ADMIN_NOT_FOUND));
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(statusCode.UNAUTHORIZED).json(errorResponse(statusCode.UNAUTHORIZED, true, MSG.ADMIN_LOGIN_FAILED));
    }

    return res.status(statusCode.OK).json(successResponse(statusCode.OK, false, MSG.ADMIN_LOGIN_SUCCESS, admin));
    
  } catch (error) {
    console.log("Error :", error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(errorResponse(statusCode.INTERNAL_SERVER_ERROR, true, MSG.INTERNAL_SERVER_ERROR));
  }
};

