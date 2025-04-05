const isLocalhost = window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost';

export const API_BASE_URL = isLocalhost
  ? 'http://localhost:3000'  // seu servidor local
  : 'https://api-fotos-chapas-production.up.railway.app';  // produção
