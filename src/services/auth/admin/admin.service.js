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
}