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
      required: true,
    },
    isAdmin:{
        type:Boolean,
        required: true,
    },
    isManager:{
        type:Boolean,
        required: true,
    },
    isEditPermission:{
        type:Boolean,
        required: true,
    },
    forgetPassword: {
      time: Date,
      otp: String,
    },
  },
  { collection: "User" }
);

module.exports = mongoose.model("User", userSchema);
