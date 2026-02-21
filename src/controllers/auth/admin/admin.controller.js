const AdminAuthServices = require("../../../services/auth/admin/admin.service");
const { MSG } = require("../../../utils/msg");
const { errorResponse, successResponse } = require("../../../utils/response");

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
      return res
        .status(400)
        .json(errorResponse(400, true, MSG.ADMIN_REGISTRATION_FAILED));
    }
    return res
      .status(201)
      .json(
        successResponse(201, false, MSG.ADMIN_REGISTRATION_SUCCESS, newAdmin),
      );
  } catch (error) {
    console.log("Error :", error);
    return res.status(500).json(errorResponse(500, true, error.message));
  }
};

module.exports.loginAdmin = async (req, res) => {
  try {
  } catch (error) {
    console.log("Error :", error);
  }
};
