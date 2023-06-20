var express = require("express");
var router = express.Router();
const {
  ServicesCard,
  CreateServices,
  EditServices,
  StatusServices,
} = require("../Controller/servicesController");

router.post("/", async function (req, res, next) {
  try {
    const { emailid, password } = await req.body;
    var reponse = await ServicesCard(emailid, password);
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

router.post("/create", async function (req, res, next) {
  try {
    const { loginDataFromCookie, create } = await req.body;
    var reponse = await CreateServices(
      loginDataFromCookie.emailid,
      loginDataFromCookie.password,
      create
    );
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

router.post("/edit", async function (req, res, next) {
  try {
    const { loginDataFromCookie, edit } = await req.body;
    var reponse = await EditServices(
      loginDataFromCookie.emailid,
      loginDataFromCookie.password,
      edit
    );
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

router.post("/status", async function (req, res, next) {
  try {
    const { loginDataFromCookie, id, status } = await req.body;
    var reponse = await StatusServices(
      loginDataFromCookie.emailid,
      loginDataFromCookie.password,
      id,
      status
    );
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
