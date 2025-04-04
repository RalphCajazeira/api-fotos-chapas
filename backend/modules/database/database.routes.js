const express = require("express");
const router = express.Router();
const controller = require("./database.controller");

router.get("/", controller.getDatabase);

module.exports = router;
