var express = require('express');
var router = express.Router();
const { AuthenticateUser } = require("../Controller/loginController");

router.post('/',async function(req, res, next) {
    try {
        const { emailid, password } = await req.body;
        var loginCredentials = await AuthenticateUser(emailid, password);
        if (loginCredentials === false) {
          res.status(200).send(false);
        } else {
          res.status(200).send(true);
        }
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
});

module.exports = router;