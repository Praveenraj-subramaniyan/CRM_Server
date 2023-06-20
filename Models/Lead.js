const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "New",
      required: true,
    },
  },
  { collection: "Lead" }
);

module.exports = mongoose.model("Lead", leadSchema);