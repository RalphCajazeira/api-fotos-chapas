const express = require("express");
const cors = require("cors");
const corsOptions = require("./shared/cors");

const app = express();

// 🌐 Log da origem da requisição para debug de CORS
app.use((req, res, next) => {
  console.log("📡 Origem da requisição:", req.headers.origin || "local");
  next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔁 Teste rápido de conexão
app.get("/ping", (req, res) => res.send("pong 🧠"));

// 📦 Rotas organizadas por domínio
const dbTestRoutes = require("./modules/database/db.routes");
app.use("/", dbTestRoutes);

const folderRoutes = require("./modules/folder/folder.routes");
app.use("/folders", folderRoutes);

const fileRoutes = require("./modules/file/file.routes");
app.use("/files", fileRoutes);

// 🧹 Rota para resetar dados (admin)
const resetRoutes = require("./routes/reset.routes");
app.use("/admin", resetRoutes); // => POST http://localhost:3000/admin/reset

module.exports = app;
