const ServiceRequest = require("../Models/ServiceRequest");
const mongoose = require("mongoose");
const { AuthenticateUser } = require("../Controller/loginController");
const User = require("../Models/User");
const { sendMail } = require("../Controller/SendMail");

async function ServicesCard(emailid, password) {
  try {
    var loginCredentials = await AuthenticateUser(emailid, password);
    if (loginCredentials === false) {
      return false;
    } else {
      const services = await ServiceRequest.find().lean();
      return services;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function CreateServices(emailid, password, create) {
  try {
    var loginCredentials = await AuthenticateUser(emailid, password);
    if (
      loginCredentials === false ||
      loginCredentials.isEditPermission === false
    ) {
      return false;
    } else {
      const services = new ServiceRequest(create);
      await services.save();
      const usersWithRoles = await FindUsersWithAdminOrManagerRole();
      const toEmail = usersWithRoles.map((user) => user.email);
      const subject = "New services Created";
      const content = `
      <h4>Hi Eveyone,</h4>
      <h5></h5>
      <p>A new services for ${create.company} is created by ${loginCredentials.name} - ${loginCredentials.email}"</p>
      <p>Regards,</p>
      <p>CRM</p>
      `;
      sendMail(toEmail, subject, content);
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function EditServices(emailid, password, edit) {
  try {
    var loginCredentials = await AuthenticateUser(emailid, password);
    if (
      loginCredentials === false ||
      loginCredentials.isEditPermission === false
    ) {
      return false;
    } else {
      const services = await ServiceRequest.findById(edit.id);
      if (!services) {
        return false;
      }
      services.name = edit.name;
      services.email = edit.email;
      services.phone = edit.phone;
      services.company = edit.company;
      services.title = edit.title;
      services.description = edit.description;
      await services.save();
      const usersWithRoles = await FindUsersWithAdminOrManagerRole();
      const toEmail = usersWithRoles.map((user) => user.email);
      const subject = "Edit services";
      const content = `
      <h4>Hi Eveyone,</h4>
      <h5></h5>
      <p><b>${edit.company}</b> details is edited by ${loginCredentials.name} - ${loginCredentials.email}"</p>
      <p>Regards,</p>
      <p>CRM</p>
      `;
      sendMail(toEmail, subject, content);
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function StatusServices(emailid, password, id,status) {
    console.log("status", status);
    try {
      var loginCredentials = await AuthenticateUser(emailid, password);
      if (
        loginCredentials === false ||
        loginCredentials.isEditPermission === false
      ) {
        return false;
      } else {
        const services = await ServiceRequest.findById(id);
        if (!services) {
          return false;
        }
        services.status = status;
        await services.save();
        const usersWithRoles = await FindUsersWithAdminOrManagerRole();
        const toEmail = usersWithRoles.map((user) => user.email);
        const subject = "Edit services";
        const content = `
        <h4>Hi Eveyone,</h4>
        <h5></h5>
        <p><b>${services.company}</b>  status is changed into <b>${status}</b>  by ${loginCredentials.name} - ${loginCredentials.email}"</p>
        <p>Regards,</p>
        <p>CRM</p>
        `;
        sendMail(toEmail, subject, content);
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

async function FindUsersWithAdminOrManagerRole() {
  try {
    const users = await User.find({
      $or: [{ isAdmin: true }, { isManager: true }],
    });
    return users;
  } catch (error) {
    console.log(error);
    return [];
  }
}

module.exports = { ServicesCard, CreateServices, EditServices , StatusServices };
