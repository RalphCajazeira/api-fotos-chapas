const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "https://ralphcajazeira.github.io",
  "http://127.0.0.1:3001",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("❌ Origem não permitida pelo CORS"));
  },
};

module.exports = corsOptions;
