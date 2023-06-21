const User = require("../Models/User");
const VerifyUser = require("../Models/VerifyUser");
const { sendMail } = require("../Controller/SendMail");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { AuthenticateUser } = require("../Controller/loginController");
const { generateOTP } = require("../Controller/passwordController");
dotenv.config();

async function InsertSignUpUser(token) {
  try {
    const userVerify = await VerifyUser.findOne({ token: token });
    if (userVerify) {
      const password = generateOTP();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        name: userVerify.name,
        email: userVerify.email,
        password:hashedPassword,
        isAdmin:userVerify.isAdmin,
        isManager:userVerify.isManager,
        isEditPermission:userVerify.isEditPermission,
        forgetPassword: {},
      });
      await newUser.save();
      await userVerify.deleteOne({ token: token });
      const content = `
  <h4>Hi there,</h4>
  <h5>Welcome to CRM</h5>
  <p>your account has been successfully registered in CRM</p>
  <p>Your password is ${password}, You can go to reset password page to reset your password</p>
  <p>Click below link to login into your account.</p>
  <a href="https://master--praveenswiggycloneapp.netlify.app/">https://master--praveenswiggycloneapp.netlify.app//</a>`;
      sendMail(newUser.email, "Registration Successful", content);
      return `
      <html>
        <head>
          <title>Registration Successful</title>
        </head>
        <body>
          <h1>Registration Successful</h1>
          <p>Your account has been successfully registered in CRM.</p>
          <p>Your account password has been sent to your email.</p>
          <p>Click below link to login into your account.</p>
          <a href="https://master--praveenswiggycloneapp.netlify.app/">https://master--praveenswiggycloneapp.netlify.app/</a>
        </body>
      </html>`;
    }
    return `<html>
    <head>
      <title>Registration Failed</title>
    </head>
    <body>
      <h1>Registration Failed</h1>
      <p>Link Expired...</p>
    </body>
  </html>`;
  } catch (error) {
    console.log(error);
    return `<html>
    <head>
      <title>Registration Failed</title>
    </head>
    <body>
      <h1>Registration Failed</h1>
      <p>Unexpected error happend, Please sign in again</p>
    </body>
  </html>`;
  }
}

async function InsertVerifyUser(
  name,
  email,
  role,
  isEdit,
  loginDataFromCookie
) 
{
  console.log("email",email)
  var loginCredentials = await AuthenticateUser(
    loginDataFromCookie.emailid,
    loginDataFromCookie.password
  );
  if (
    loginCredentials === false ||
    loginCredentials.isEditPermission === false
  ) {
    return false;
  } else {
    const isUserHasPermission = CheckUserPermission(
      role,
      isEdit,
      loginCredentials.isAdmin,
      loginCredentials.isManager
    );
    if (isUserHasPermission === false) {
      return false;
    } else {
      token = generateToken(email);
      const newUser = new VerifyUser({
        token: token,
        name: name,
        email: email,
        isAdmin:isUserHasPermission.isAdmin,
        isManager:isUserHasPermission.isManager,
        isEditPermission:isUserHasPermission.Edit,
      });
      const activationLink = `https://swiggy-server-6c69.onrender.com/signup/${token}`;
      const content = `
  <h4>Hi there,</h4>
  <h5>Welcome to CRM </h5>
  <p>Thank you for signing up. Please click the link below to activate your account:</p>
  <a href="${activationLink}">${activationLink}</a>
  <p>Aftet clicking the link a randomly generated password send to your email. You can reset in reset password page</P>
  <p>Regards,</p>
  <p>CRM</p>
  `;
      await newUser.save();
      console.log("email",email)
      sendMail(email, "Verify User", content);
    }
  }
}

function generateToken(email) {
  const token = jwt.sign(email, process.env.signup_Secret_Token);
  return token;
}

function CheckUserPermission(role, isEdit, isAdmin, isManager) {
  if (isAdmin) {
    if (role === "admin") {
      const isAdmin = true;
      const isManager = true;
      const Edit = true;
      return {isAdmin, isManager, Edit};
    } else if (role === "manager") {
      const isAdmin = false;
      const isManager = true;
      const Edit = true;
      return {isAdmin, isManager, Edit};
    } else if (role === "employee") {
      const isAdmin = false;
      const isManager = false;
      const Edit = isEdit === true? true: false;
      return {isAdmin, isManager, Edit};
    } else {
      return false;
    }
  } else if (isManager) {
    if (role === "employee") {
      const isAdmin = false;
      const isManager = false;
      const Edit = isEdit === true? true: false;
      return {isAdmin, isManager, Edit};
    }
  } else {
    return false;
  }
}

module.exports = {InsertSignUpUser,InsertVerifyUser};
