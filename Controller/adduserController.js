const User = require("../Models/User");
const Lead = require("../Models/Lead");
const ServiceRequest = require("../Models/ServiceRequest");
const mongoose = require("mongoose");
const { AuthenticateUser } = require("../Controller/loginController");

async function UserVerification(emailid, password) {
  try {
    var loginCredentials = await AuthenticateUser(emailid, password);
    console.log(loginCredentials);
    if (loginCredentials === false) {
      return false;
    } else {
      if (loginCredentials.isAdmin || loginCredentials.isManager) {
        const isAdmin = loginCredentials.isAdmin;
        const isManager = loginCredentials.isManager;
        const isEditPermission = loginCredentials.isEditPermission;
        return {
          isAdmin,
          isManager,
          isEditPermission,
        };
      } else {
        return false;
      }
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = { UserVerification };
