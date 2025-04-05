const express = require("express");
const router = express.Router();
const controller = require("./folder.controller");

router.get("/", controller.listFolders);
router.get("/:id", controller.getFolderById); // 👈 nova rota

router.post("/", controller.createFolder);
router.put("/:id", controller.renameFolder);
router.delete("/:id", controller.deleteFolder);

module.exports = router;
