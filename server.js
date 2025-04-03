require('dotenv').config();
const path = require('path');
const fs = require('fs');

const {
  findDatabaseFile,
  downloadDatabase,
  createDatabaseFile,
} = require('./utils/drive');

const DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_SITE_FOLDER_ID;
const DB_LOCAL_PATH = path.join(__dirname, 'data', 'db.json');

async function init() {
  console.log('🚀 Iniciando verificação do banco no Google Drive...');

  // Cria a pasta local se necessário
  if (!fs.existsSync(path.dirname(DB_LOCAL_PATH))) {
    fs.mkdirSync(path.dirname(DB_LOCAL_PATH));
  }

  const existing = await findDatabaseFile(DRIVE_FOLDER_ID);

  if (existing) {
    console.log('📥 Banco encontrado no Drive. Baixando...');
    await downloadDatabase(existing.id, DB_LOCAL_PATH);
    console.log('✅ Banco sincronizado localmente!');
  } else {
    console.log('📁 Banco não encontrado. Criando novo...');
    const newId = await createDatabaseFile(DRIVE_FOLDER_ID, DB_LOCAL_PATH);
    console.log(`✅ Banco criado e enviado ao Drive com ID: ${newId}`);
  }

  // Carrega o banco em memória (caso queira manipular depois)
  const db = JSON.parse(fs.readFileSync(DB_LOCAL_PATH, 'utf-8'));
  console.log(`📄 Banco carregado: ${db.chapas.length} chapas`);

  // Aqui você pode iniciar o servidor Express futuramente
}

init().catch(err => {
  console.error('❌ Erro ao inicializar:', err);
});
