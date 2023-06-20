var express = require('express');
var router = express.Router();
const { DashboardCard } = require("../Controller/homeController");

router.post('/',async function(req, res, next) {
    try {
        const { emailid, password } = await req.body;
        var reponse = await DashboardCard(emailid, password);
        if (reponse === false) {
          res.status(400).send("login");
        } else {
          res.status(200).send(reponse);
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("login");
      }
});

module.exports = router;