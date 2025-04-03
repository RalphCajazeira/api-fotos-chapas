const express = require("express");
const router = express.Router();
const multer = require("../../shared/multer");
const controller = require("./chapa.controller");

// RESTful rotas
router.get("/", controller.listarChapas);
router.get("/:id", controller.buscarChapa);
router.post("/", multer.single("foto"), controller.criarChapa);
router.delete("/:id", controller.removerChapa);

module.exports = router;
