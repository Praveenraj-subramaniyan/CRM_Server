const User = require("../Models/User");
const Lead = require("../Models/Lead");
const ServiceRequest = require("../Models/ServiceRequest");
const mongoose = require("mongoose");
const { AuthenticateUser } = require("../Controller/loginController");

async function DashboardCard(emailid, password) {
  try {
    var loginCredentials = await AuthenticateUser(emailid, password);
    console.log(loginCredentials);
    if (loginCredentials === false) {
      return false;
    } else {
      const totalUserCount = await User.countDocuments();
      const totalLeadCount = await Lead.countDocuments();
      const totalServicesCount = await ServiceRequest.countDocuments();
      const isAdmin = loginCredentials.isAdmin;
      const isManager = loginCredentials.isManager;
      const isEditPermission = loginCredentials.isEditPermission;
      return {
        totalUserCount,
        totalLeadCount,
        totalServicesCount,
        isAdmin,
        isManager,
        isEditPermission,
      };
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = { DashboardCard };
