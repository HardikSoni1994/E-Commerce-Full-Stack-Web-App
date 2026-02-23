const adminModel = require("../../../models/admin.model");
const Admin = require("../../../models/admin.model");

module.exports = class AdminAuthServices {
    async registerAdmin(body) {
        try {
            return await Admin.create(body);
        }
        catch (error) {
            console.log("Admin Register Error:", error);
            
        }
    }

    async singleAdmin(body) {
        try {
            return await Admin.findOne(body);
        } catch (error) {
            console.log("Single Admin Fetch Error", error);
        }
    }

    async fetchAllAdmin() {
        try {
            return await adminModel.find({ isDelete: false});
        } catch (error) {
            console.log("fetch All Admin Error", error);
            
        }
    }
}