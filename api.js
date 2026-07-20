// ==========================================
// UNIWEAR FRONTEND API HELPER
// api.js — v1.5
// ==========================================
// Clean explicit API functions. No global overrides.
// localStorage is used only as a session cache.
// Always call API helpers for writes/reads that need persistence.
// ==========================================

const API_BASE =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://uniwear-api.onrender.com/api';

// ─── Token Management ────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('uniwear_jwt_token') || '';
}

function setToken(token) {
  localStorage.setItem('uniwear_jwt_token', token);
}

function clearToken() {
  localStorage.removeItem('uniwear_jwt_token');
}

// ─── Core Fetch Helpers ───────────────────────────────────────────────────────

/**
 * Perform an authenticated GET request.
 * @param {string} path  - API path, e.g. '/leads'
 * @param {Object} query - Optional query params object, e.g. { clientEmail: 'x@y.com' }
 * @returns {Promise<Object>} Parsed JSON response body
 */
async function apiGet(path, query = {}) {
  const url = new URL(API_BASE + path);
  Object.entries(query).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'API error');
  return data;
}

/**
 * Perform a POST request (public or authenticated).
 * @param {string} path    - API path, e.g. '/leads'
 * @param {Object} payload - Request body
 * @param {boolean} auth   - Whether to include the JWT token (default true)
 * @returns {Promise<Object>} Parsed JSON response body
 */
async function apiPost(path, payload = {}, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'API error');
  return data;
}

/**
 * Perform an authenticated PATCH request.
 * @param {string} path    - API path including ID, e.g. '/users/abc123'
 * @param {Object} payload - Fields to update
 * @returns {Promise<Object>} Parsed JSON response body
 */
async function apiPatch(path, payload = {}) {
  const res = await fetch(API_BASE + path, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'API error');
  return data;
}

/**
 * Perform an authenticated DELETE request.
 * @param {string} path - API path including ID
 * @returns {Promise<Object>} Parsed JSON response body
 */
async function apiDelete(path) {
  const res = await fetch(API_BASE + path, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'API error');
  return data;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * Log in a user. Stores JWT and auth state in localStorage on success.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} { token, authRole, user }
 */
async function apiLogin(email, password) {
  const res = await fetch(API_BASE + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Login failed');

  // Cache auth state in localStorage (session cache only)
  setToken(data.token);
  localStorage.setItem('uniwear_auth_role', data.authRole);
  localStorage.setItem('uniwear_auth_role_details', data.user.role);
  localStorage.setItem('uniwear_auth_email', data.user.email);
  localStorage.setItem('uniwear_auth_id', data.user._id);

  if (data.authRole === 'client') {
    const profile = {
      _id: data.user._id,
      companyName: data.user.companyName || '',
      representative: data.user.representative || '',
      email: data.user.email,
      phone: data.user.phone || '',
      address: data.user.address || ''
    };
    localStorage.setItem('uniwear_profile', JSON.stringify(profile));
  }

  return data;
}

/**
 * Register a new customer account.
 * @param {Object} payload - { companyName, representative, email, phone, password }
 * @returns {Promise<Object>} API response
 */
async function apiRegister(payload) {
  return apiPost('/auth/register', payload, false);
}

/**
 * Log out: clears token and all cached auth state.
 */
function apiLogout() {
  clearToken();
  localStorage.removeItem('uniwear_auth_role');
  localStorage.removeItem('uniwear_auth_role_details');
  localStorage.removeItem('uniwear_auth_email');
  localStorage.removeItem('uniwear_auth_id');
  localStorage.removeItem('uniwear_profile');
}

// ─── Resource Helpers ─────────────────────────────────────────────────────────
// These match the backend route structure exactly.

const api = {
  // Auth
  login: apiLogin,
  register: apiRegister,
  logout: apiLogout,

  // Users (admin)
  getUsers: () => apiGet('/users'),
  updateUser: (id, data) => apiPatch(`/users/${id}`, data),
  deleteUser: (id) => apiDelete(`/users/${id}`),

  // Leads
  getLeads: () => apiGet('/leads'),
  createLead: (data) => apiPost('/leads', data, false), // public: contact form, no auth needed
  updateLead: (id, data) => apiPatch(`/leads/${id}`, data),
  deleteLead: (id) => apiDelete(`/leads/${id}`),

  // Quotations
  getQuotations: (clientEmail) => apiGet('/quotations', clientEmail ? { clientEmail } : {}),
  createQuotation: (data) => apiPost('/quotations', data),
  updateQuotation: (id, data) => apiPatch(`/quotations/${id}`, data),

  // Orders
  getOrders: (clientEmail) => apiGet('/orders', clientEmail ? { clientEmail } : {}),
  createOrder: (data) => apiPost('/orders', data),
  updateOrder: (id, data) => apiPatch(`/orders/${id}`, data),

  // Tickets
  getTickets: (clientEmail) => apiGet('/tickets', clientEmail ? { clientEmail } : {}),
  createTicket: (data) => apiPost('/tickets', data),
  updateTicket: (id, data) => apiPatch(`/tickets/${id}`, data),

  // Notifications
  getNotifications: (recipient) => apiGet('/notifications', recipient ? { recipient } : {}),
  createNotification: (data) => apiPost('/notifications', data),

  // Company Settings
  getSettings: () => apiGet('/company-settings'),
  updateSettings: (data) => apiPatch('/company-settings', data),

  // Products (CMS)
  getProducts: (params) => apiGet('/products', params),
  createProduct: (data) => apiPost('/products', data),
  updateProduct: (id, data) => apiPatch(`/products/${id}`, data),
  deleteProduct: (id) => apiDelete(`/products/${id}`),

  // Catalog (CMS)
  getCatalogs: (params) => apiGet('/catalog', params),
  createCatalog: (data) => apiPost('/catalog', data),
  updateCatalog: (id, data) => apiPatch(`/catalog/${id}`, data),
  deleteCatalog: (id) => apiDelete(`/catalog/${id}`),

  // Blogs (CMS)
  getBlogs: (params) => apiGet('/blogs', params),
  createBlog: (data) => apiPost('/blogs', data),
  updateBlog: (id, data) => apiPatch(`/blogs/${id}`, data),
  deleteBlog: (id) => apiDelete(`/blogs/${id}`),

  // Dashboard Stats
  getDashboardStats: () => apiGet('/dashboard/stats'),

  // Raw helpers for custom calls
  get: apiGet,
  post: apiPost,
  patch: apiPatch,
  delete: apiDelete,
  getToken,
  setToken,
  clearToken
};

// Expose globally so all HTML pages can call window.api.*
window.api = api;
