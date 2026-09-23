// UNIWEAR Site Configuration
window.UNIWEAR_CONFIG = {
  // Automatically select local Express server (http://localhost:5000/api) during local development,
  // explicit window.UNIWEAR_BACKEND_URL or localStorage 'uniwear_api_base' if set,
  // or relative same-origin path (/api) when proxied on Vercel.
  API_BASE: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? 'http://localhost:5000/api'
    : (window.UNIWEAR_BACKEND_URL || localStorage.getItem('uniwear_api_base') || '/api')
};

