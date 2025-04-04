const express = require("express");
const cors = require("cors");
const corsOptions = require("./shared/cors"); // 👈 novo caminho

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => res.send("pong 🧠"));

const databaseRoutes = require("./modules/database/database.routes");
app.use("/database", databaseRoutes);

// const pastaRoutes = require("./modules/folder/folder.routes");
// app.use("/pastas", pastaRoutes);

module.exports = app;
