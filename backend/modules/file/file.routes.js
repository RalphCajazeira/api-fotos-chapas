const express = require("express");
const router = express.Router();
const controller = require("./file.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", controller.getAll);
router.get("/folder/:folder_id", controller.getByFolder);
router.post("/", upload.single("file"), controller.upload);
router.delete("/:id", controller.remove);

module.exports = router;
