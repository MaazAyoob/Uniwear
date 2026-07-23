// UNIWEAR Site Configuration
window.UNIWEAR_CONFIG = {
  // Automatically select local Express server (http://localhost:5000/api) during local development,
  // or relative same-origin path (/api) when deployed to Vercel/Production.
  API_BASE: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5000/api'
    : '/api'
};
