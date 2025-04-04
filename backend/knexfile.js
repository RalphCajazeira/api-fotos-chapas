require("dotenv").config();
const { parse } = require("pg-connection-string");

// Transforma a DATABASE_URL em objeto
const dbConfig = parse(process.env.DATABASE_URL);

module.exports = {
  development: {
    client: "pg",
    connection: {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      directory: "./database/migrations",
    },
    useNullAsDefault: true,
  },
};
