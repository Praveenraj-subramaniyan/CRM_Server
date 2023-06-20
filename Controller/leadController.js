const Lead = require("../Models/Lead");
const mongoose = require("mongoose");
const { AuthenticateUser } = require("../Controller/loginController");
const User = require("../Models/User");
const { sendMail } = require("../Controller/SendMail");

async function LeadCard(emailid, password) {
  try {
    var loginCredentials = await AuthenticateUser(emailid, password);
    if (loginCredentials === false) {
      return false;
    } else {
      const leads = await Lead.find().lean();
      return leads;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function CreateLead(emailid, password, create) {
  try {
    var loginCredentials = await AuthenticateUser(emailid, password);
    if (
      loginCredentials === false ||
      loginCredentials.isEditPermission === false
    ) {
      return false;
    } else {
      const lead = new Lead(create);
      await lead.save();
      const usersWithRoles = await FindUsersWithAdminOrManagerRole();
      const toEmail = usersWithRoles.map((user) => user.email);
      const subject = "New Lead Created";
      const content = `
      <h4>Hi Eveyone,</h4>
      <h5></h5>
      <p>A new lead for ${create.company} is created by ${loginCredentials.name} - ${loginCredentials.email}"</p>
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

async function EditLead(emailid, password, edit) {
  try {
    var loginCredentials = await AuthenticateUser(emailid, password);
    if (
      loginCredentials === false ||
      loginCredentials.isEditPermission === false
    ) {
      return false;
    } else {
      const lead = await Lead.findById(edit.id);
      if (!lead) {
        return false;
      }
      lead.name = edit.name;
      lead.email = edit.email;
      lead.phone = edit.phone;
      lead.company = edit.company;
      await lead.save();
      const usersWithRoles = await FindUsersWithAdminOrManagerRole();
      const toEmail = usersWithRoles.map((user) => user.email);
      const subject = "Edit lead";
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
async function StatusLead(emailid, password, id,status) {
    console.log("status", status);
    try {
      var loginCredentials = await AuthenticateUser(emailid, password);
      if (
        loginCredentials === false ||
        loginCredentials.isEditPermission === false
      ) {
        return false;
      } else {
        const lead = await Lead.findById(id);
        if (!lead) {
          return false;
        }
        lead.status = status;
        await lead.save();
        const usersWithRoles = await FindUsersWithAdminOrManagerRole();
        const toEmail = usersWithRoles.map((user) => user.email);
        const subject = "Edit lead";
        const content = `
        <h4>Hi Eveyone,</h4>
        <h5></h5>
        <p><b>${lead.company}</b> status is changed into <b>${status}</b>  by ${loginCredentials.name} - ${loginCredentials.email}"</p>
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

module.exports = { LeadCard, CreateLead, EditLead , StatusLead };
