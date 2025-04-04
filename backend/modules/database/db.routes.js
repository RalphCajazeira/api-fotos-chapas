const express = require("express");
const router = express.Router();
const controller = require("./db.controller");

router.get("/ping-db", controller.pingDatabase);

module.exports = router;
