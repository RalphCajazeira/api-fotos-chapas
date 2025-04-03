const fs = require('fs');
const path = require('path');
const { uploadFileToDrive } = require('../utils/drive');

const DB_LOCAL_PATH = path.join(__dirname, '../data/db.json');
const FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;

async function uploadChapa(req, res) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'Arquivo não encontrado' });

    const uploaded = await uploadFileToDrive(file, FOLDER_ID);
    fs.unlinkSync(file.path);

    const db = JSON.parse(fs.readFileSync(DB_LOCAL_PATH, 'utf-8'));
    const novaChapa = {
      id: Date.now(),
      nome: file.originalname,
      url: `https://drive.google.com/file/d/${uploaded.id}/view`,
      driveId: uploaded.id,
    };

    db.chapas.push(novaChapa);
    fs.writeFileSync(DB_LOCAL_PATH, JSON.stringify(db, null, 2));

    res.json({ success: true, fileName: file.originalname, chapa: novaChapa });
  } catch (err) {
    console.error('❌ Erro no controller upload:', err);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
}

module.exports = { uploadChapa };
