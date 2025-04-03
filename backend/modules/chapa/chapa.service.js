const fs = require('fs');
const path = require('path');
const { uploadFileToDrive, deleteFileFromDrive } = require('../../config/drive');
const DB_PATH = path.join(__dirname, '../../data/db.json');

function carregarDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return raw.trim() ? JSON.parse(raw) : { chapas: [] };
}

function salvarDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

async function getAll() {
  return carregarDB().chapas;
}

async function getById(id) {
  const db = carregarDB();
  return db.chapas.find(c => String(c.id) === String(id));
}

async function create(file) {
  const db = carregarDB();
  const uploaded = await uploadFileToDrive(file, process.env.GOOGLE_DRIVE_SITE_FOLDER_ID);
  fs.unlinkSync(file.path); // remove arquivo local temporário

  const novaChapa = {
    id: Date.now(),
    nome: file.originalname,
    url: `https://drive.google.com/file/d/${uploaded.id}/view`,
    driveId: uploaded.id,
  };

  db.chapas.push(novaChapa);
  salvarDB(db);
  return novaChapa;
}

async function remove(id) {
  const db = carregarDB();
  const index = db.chapas.findIndex(c => String(c.id) === String(id));
  if (index === -1) return false;

  const [chapa] = db.chapas.splice(index, 1);
  if (chapa.driveId) {
    await deleteFileFromDrive(chapa.driveId);
  }

  salvarDB(db);
  return true;
}

module.exports = {
  getAll,
  getById,
  create,
  remove,
};
