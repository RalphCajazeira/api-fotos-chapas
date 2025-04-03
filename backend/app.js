const express = require("express");
const cors = require("cors");
const corsOptions = require("./shared/cors"); // 👈 novo caminho

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (req, res) => res.send("pong 🧠"));

module.exports = app;
