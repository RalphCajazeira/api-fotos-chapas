// 🌐 Inicializador do servidor Express
require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`🌐 Servidor rodando em ${BASE_URL}`);
});
