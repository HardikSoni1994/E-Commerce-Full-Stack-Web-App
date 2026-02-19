const mongoose = require('mongoose');

// Yeh raha aapka simple 'Sir wala logic'
const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB Connected Successfully");
    })
    .catch((err) => {
      console.log("Connection Error: ", err);
    });
};

module.exports = connectDB;