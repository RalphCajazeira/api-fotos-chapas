const express = require("express");
const cors = require("./shared/cors");
const chapaRoutes = require("./modules/chapa/chapa.routes");

const app = express();
app.use(cors);
app.use(express.json());

app.use("/chapas", chapaRoutes); // ← todas as rotas serão com /chapas

module.exports = app;
