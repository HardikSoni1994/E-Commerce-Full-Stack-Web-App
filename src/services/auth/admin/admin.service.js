const Admin = require("../../../models/admin.model");

module.exports = class AdminAuthServices {
  async registerAdmin(body) {
    try {
      return await Admin.create(body);
    } catch (error) {
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
      return await Admin.find({ isDelete: false }).select('_id first_name last_name email phone isActive create_at update_at');
    } catch (error) {
      console.log("fetch All Admin Error", error);
    }
  }

  async updateAdmin(id, body) {
    try {
      // Sir ne { new: true } lagwaya hai taaki update hone ke baad naya data return ho
      return await Admin.findByIdAndUpdate(id, body, { new: true }).select('_id first_name last_name email phone isActive create_at update_at');
    } catch (error) {
      console.log("Update Admin Error", error);
    }
  }

  async deleteAdmin(id) {
        try {
            
            return await Admin.findByIdAndUpdate(
                id, 
                { isDelete: true }, 
                { new: true }
            );
        } catch (error) {
            console.log("Delete Admin Error", error);
        }
    }
};
