const express = require("express");
const router = express.Router();
const controller = require("./folder.controller");

// 🔧 POST /folders → Cria uma nova pasta
router.post("/", controller.create);

module.exports = router;
