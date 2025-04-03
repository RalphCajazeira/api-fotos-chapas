// server/server.js
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { uploadFileToDrive } = require("./utils/drive");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("foto"), async (req, res) => {
  try {
    const file = req.file;

    const uploaded = await uploadFileToDrive(
      file,
      process.env.GOOGLE_DRIVE_SITE_FOLDER_ID
    );

    // Apaga arquivo local depois do upload
    fs.unlinkSync(file.path);

    res.json({ success: true, fileId: uploaded.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
