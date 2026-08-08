// ==========================================
// UNIWEAR FRONTEND API HELPER
// api.js — v2.0 (Production)
// ==========================================
// Clean explicit API functions. No silent fallbacks on mutations.
// Writes (POST/PATCH/PUT/DELETE) throw real errors — the UI must handle them.
// Reads (GET) fall back to localStorage cache when offline, but log clearly.
// ==========================================

function getApiBase() {
  // 1. Explicit configuration from window.UNIWEAR_CONFIG
  if (window.UNIWEAR_CONFIG && window.UNIWEAR_CONFIG.API_BASE !== undefined && window.UNIWEAR_CONFIG.API_BASE !== '') {
    return window.UNIWEAR_CONFIG.API_BASE;
  }
  
  // 2. Local development fallback (localhost / local file system)
  const host = window.location.hostname;
  const protocol = window.location.protocol;
  if (host === 'localhost' || host === '127.0.0.1' || protocol === 'file:') {
    return 'http://localhost:5000/api';
  }
  
  // 3. Automatic same-origin detection
  return '/api';
}

const API_BASE = getApiBase();

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
 * Safely parse HTTP response to JSON, throwing readable error if non-JSON (e.g. HTML 404/500).
 */
async function safeParseResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!contentType.includes('application/json')) {
    if (res.status === 404) {
      throw new Error(`Backend API route not found (404). Check backend deployment or proxy URL.`);
    }
    if (res.status === 401) {
      throw new Error(`Unauthorized (401). Please log in again.`);
    }
    if (res.status === 403) {
      throw new Error(`Access denied (403). Insufficient permissions.`);
    }
    const snippet = text.length > 60 ? text.slice(0, 60) + '...' : text;
    throw new Error(`Server returned non-JSON response (${res.status}): "${snippet.replace(/[\r\n]+/g, ' ')}"`);
  }

  try {
    return JSON.parse(text);
  } catch (parseErr) {
    throw new Error(`Invalid JSON format from server (${res.status}).`);
  }
}

/**
 * Perform an authenticated GET request.
 * Falls back to localStorage cache if the backend is unreachable.
 * @param {string} path  - API path, e.g. '/leads'
 * @param {Object} query - Optional query params object
 * @returns {Promise<Object>} Parsed JSON response body
 */
async function apiGet(path, query = {}) {
  let urlString;
  try {
    const base = API_BASE.startsWith('http')
      ? API_BASE
      : window.location.origin + (API_BASE.startsWith('/') ? API_BASE : '/' + API_BASE);
    const url = new URL(base + path);
    Object.entries(query).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, v));
    urlString = url.toString();
  } catch (urlErr) {
    urlString = API_BASE + path;
  }

  try {
    const res = await fetch(urlString, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    const data = await safeParseResponse(res);
    if (!data.success) throw new Error(data.message || 'API error');
    return data;
  } catch (err) {
    console.warn(`[apiGet ${path}] Backend unavailable, using localStorage cache:`, err.message);
    // Read-only localStorage fallback — acceptable for offline/degraded mode
    const basePath = path.split('?')[0];
    const cacheMap = {
      '/users':            () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_users')) || [] }),
      '/leads':            () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_leads')) || [] }),
      '/quotations':       () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_quotations')) || [] }),
      '/orders':           () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_orders')) || [] }),
      '/tickets':          () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_tickets')) || [] }),
      '/company-settings': () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_company_settings')) || {} }),
      '/notifications':    () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_notifications')) || [] }),
      '/products':         () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_products')) || [] }),
      '/blogs':            () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_blogs')) || [] }),
      '/catalogs':         () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_catalogs')) || [] }),
      '/catalog':          () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_catalogs')) || [] }),
      '/dashboard/stats':  () => {
        const products = JSON.parse(localStorage.getItem('uniwear_products')) || [];
        const blogs    = JSON.parse(localStorage.getItem('uniwear_blogs')) || [];
        const leads    = JSON.parse(localStorage.getItem('uniwear_leads')) || [];
        const quotes   = JSON.parse(localStorage.getItem('uniwear_quotations')) || [];
        const orders   = JSON.parse(localStorage.getItem('uniwear_orders')) || [];
        const users    = JSON.parse(localStorage.getItem('uniwear_users')) || [];
        return {
          success: true,
          data: {
            products: products.length,
            blogs: blogs.length,
            leads: leads.length,
            quotes: quotes.length,
            orders: orders.length,
            activeCustomers: users.filter(u => u.status === 'Active' && u.role === 'Customer').length,
            pendingCustomers: users.filter(u => u.status === 'Pending').length,
            categoriesCount: 6,
            recentActivity: []
          }
        };
      }
    };
    if (cacheMap[basePath]) {
      return cacheMap[basePath]();
    }
    return { success: true, data: [] };
  }
}

/**
 * Perform a POST request (public or authenticated).
 * THROWS real errors — no silent fallback.
 * @param {string} path    - API path, e.g. '/leads'
 * @param {Object} payload - Request body
 * @param {boolean} auth   - Whether to include the JWT token (default true)
 * @returns {Promise<Object>} Parsed JSON response body
 */
async function apiPost(path, payload = {}, auth = true) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers['Authorization'] = `Bearer ${getToken()}`;
  
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
  } catch (networkErr) {
    throw new Error(`Network error: Cannot reach the server. Is the backend running? (${networkErr.message})`);
  }
  
  const data = await safeParseResponse(res);
  if (!data.success) throw new Error(data.message || `POST ${path} failed (${res.status})`);
  return data;
}

/**
 * Perform an authenticated PATCH request.
 * THROWS real errors — no silent fallback.
 * @param {string} path    - API path including ID
 * @param {Object} payload - Fields to update
 * @returns {Promise<Object>} Parsed JSON response body
 */
async function apiPatch(path, payload = {}) {
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload)
    });
  } catch (networkErr) {
    throw new Error(`Network error: Cannot reach the server. Is the backend running? (${networkErr.message})`);
  }

  const data = await safeParseResponse(res);
  if (!data.success) throw new Error(data.message || `PATCH ${path} failed (${res.status})`);
  return data;
}

/**
 * Perform an authenticated PUT request.
 * THROWS real errors — no silent fallback.
 */
async function apiPut(path, payload = {}) {
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload)
    });
  } catch (networkErr) {
    throw new Error(`Network error: Cannot reach the server. Is the backend running? (${networkErr.message})`);
  }

  const data = await safeParseResponse(res);
  if (!data.success) throw new Error(data.message || `PUT ${path} failed (${res.status})`);
  return data;
}

/**
 * Perform an authenticated DELETE request.
 * THROWS real errors — no silent fallback.
 * @param {string} path - API path including ID
 * @returns {Promise<Object>} Parsed JSON response body
 */
async function apiDelete(path) {
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
  } catch (networkErr) {
    throw new Error(`Network error: Cannot reach the server. Is the backend running? (${networkErr.message})`);
  }

  const data = await safeParseResponse(res);
  if (!data.success) throw new Error(data.message || `DELETE ${path} failed (${res.status})`);
  return data;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

/**
 * Log in a user. Stores JWT and auth state in localStorage on success.
 * THROWS real errors — requires a working backend.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} { token, authRole, user }
 */
async function apiLogin(email, password) {
  let res;
  try {
    res = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
  } catch (networkErr) {
    throw new Error(`Cannot connect to server. Please ensure the backend is running and try again. (${networkErr.message})`);
  }

  const data = await safeParseResponse(res);
  if (!data.success) throw new Error(data.message || 'Login failed');

  // Cache auth state in localStorage (session cache only)
  setToken(data.token);
  localStorage.setItem('uniwear_auth_role', data.authRole);
  localStorage.setItem('uniwear_auth_role_details', data.user.role);
  localStorage.setItem('uniwear_auth_email', data.user.email);
  localStorage.setItem('uniwear_auth_id', data.user._id || data.user.id);

  if (data.authRole === 'client') {
    const profile = {
      _id: data.user._id || data.user.id,
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
 * THROWS real errors — requires a working backend.
 * @param {Object} payload - { companyName, representative, email, phone, password }
 * @returns {Promise<Object>} API response
 */
async function apiRegister(payload) {
  return await apiPost('/auth/register', payload, false);
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
  getUsers: (params) => apiGet('/users', params),
  updateUser: (id, data) => apiPatch(`/users/${id}`, data),
  deleteUser: (id) => apiDelete(`/users/${id}`),

  // Leads
  getLeads: (params) => apiGet('/leads', params),
  createLead: (data) => apiPost('/leads', data, false), // public: contact form, no auth needed
  updateLead: (id, data) => apiPatch(`/leads/${id}`, data),
  deleteLead: (id) => apiDelete(`/leads/${id}`),

  // Quotations
  getQuotations: (param) => apiGet('/quotations', param ? (typeof param === 'string' ? { clientEmail: param } : param) : {}),
  createQuotation: (data) => apiPost('/quotations', data),
  updateQuotation: (id, data) => apiPatch(`/quotations/${id}`, data),

  // Orders
  getOrders: (param) => apiGet('/orders', param ? (typeof param === 'string' ? { clientEmail: param } : param) : {}),
  createOrder: (data) => apiPost('/orders', data),
  updateOrder: (id, data) => apiPatch(`/orders/${id}`, data),

  // Tickets
  getTickets: (param) => apiGet('/tickets', param ? (typeof param === 'string' ? { clientEmail: param } : param) : {}),
  createTicket: (data) => apiPost('/tickets', data),
  updateTicket: (id, data) => apiPatch(`/tickets/${id}`, data),

  // Notifications
  getNotifications: (param) => apiGet('/notifications', param ? (typeof param === 'string' ? { recipient: param } : param) : {}),
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

  // Export
  getExportUrl: (moduleName) => `${API_BASE}/export/${moduleName}`,

  // Customer Specific Products Assignment
  getCustomerProducts: async (customerId) => {
    return await apiGet(`/customer/${customerId}/products`);
  },
  assignCustomerProducts: async (data) => {
    return await apiPost('/customer-products', data);
  },
  updateCustomerProduct: async (id, data) => {
    return await apiPut(`/customer-products/${id}`, data);
  },
  removeCustomerProduct: async (id) => {
    return await apiDelete(`/customer-products/${id}`);
  },

  // Raw helpers for custom calls
  get: apiGet,
  post: apiPost,
  patch: apiPatch,
  put: apiPut,
  delete: apiDelete,
  getToken,
  setToken,
  clearToken
};

// Expose globally so all HTML pages can call window.api.*
window.api = api;
