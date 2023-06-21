const express = require("express");
var router = express.Router();
const { CheckUser } = require("../Controller/loginController");
const {
   InsertSignUpUser,
  InsertVerifyUser,
} = require("../Controller/signupController");

router.get("/:token", async (req, res) => {
  try {
    const response = await InsertSignUpUser(req.params.token);
    res.status(200).send(response);
  } catch (error) {
    console.log(error);
    res.status(400).send(`<html>
    <head>
      <title>Registration Failed</title>
    </head>
    <body>
      <h1>Registration Failed</h1>
      <p>Link Expired...</p>
    </body>
  </html>`);
  }
});

router.post("/verify", async (req, res) => {
  try {
    const {userDetails,
      loginDataFromCookie,} = await req.body;
    var registerCredentials = await CheckUser(userDetails.email);
    if (registerCredentials === false) {
      await InsertVerifyUser(userDetails.name,userDetails.email,userDetails.role,userDetails.isEdit,loginDataFromCookie);
      res.status(200).send(true);
    } else if (registerCredentials === true) {
      res.status(200).send("Already registered");
    }
  } catch (error) {
    console.log("catch");
    console.log(error);
    res.status(400).send("error");
  }
});

module.exports = router;
