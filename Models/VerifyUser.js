const mongoose = require("mongoose");

const verifySchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
    },
    isManager: {
      type: Boolean,
      required: true,
    },
    isEditPermission: {
      type: Boolean,
      required: true,
    },
  },
  { collection: "VerifyUser" }
);

module.exports = mongoose.model("VerifyUser", verifySchema);
