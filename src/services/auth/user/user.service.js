const User = require("../../../models/user.model");

module.exports = class UserAuthServices {
  async registerUser(body) {
    try {
      return await User.create(body);
    } catch (error) {
      console.log("User Register Error:", error);
    }
  }

  async singleUser(body) {
    try {
      return await User.findOne(body);
    } catch (error) {
      console.log("Single User Fetch Error", error);
    }
  }

  async fetchAllUser() {
    try {
      return await User.find({ isDelete: false });
    } catch (error) {
      console.log("fetch All User Error", error);
    }
  }

  async updateUser(id, body) {
        try {
            return await User.findByIdAndUpdate(id, body, { new: true });
        } catch (error) {
            console.log("Update User Error", error);
        }
    }
};
