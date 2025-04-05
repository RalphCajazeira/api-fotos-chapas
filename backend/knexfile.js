require("dotenv").config();
const { parse } = require("pg-connection-string");

const dbConfig = parse(process.env.DATABASE_URL);

module.exports = {
  client: "pg",
  connection: {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  },
  migrations: {
    directory: "./database/migrations",
  },
  useNullAsDefault: true,
};
