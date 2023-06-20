const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
    },
    isAdmin:{
        type:Boolean
    },
    isManager:{
        type:Boolean
    },
    isEditPermission:{
        type:Boolean
    },
    forgetPassword: {
      time: Date,
      otp: String,
    },
  },
  { collection: "User" }
);

module.exports = mongoose.model("User", userSchema);
