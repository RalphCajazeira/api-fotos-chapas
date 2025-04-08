const isLocalhost = ["localhost", "127.0.0.1"].includes(
  window.location.hostname
);

export const API_BASE_URL = isLocalhost
  ? "http://localhost:3000"
  : "https://api-fotos-chapas-production.up.railway.app";
