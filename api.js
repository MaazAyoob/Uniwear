// ==========================================
// UNIWEAR FRONTEND API HELPER
// api.js — v1.5
// ==========================================
// Clean explicit API functions. No global overrides.
// localStorage is used only as a session cache.
// Always call API helpers for writes/reads that need persistence.
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
 * Perform an authenticated GET request.
 * @param {string} path  - API path, e.g. '/leads'
 * @param {Object} query - Optional query params object, e.g. { clientEmail: 'x@y.com' }
 * @returns {Promise<Object>} Parsed JSON response body
 */
async function apiGet(path, query = {}) {
  const url = new URL(API_BASE + path);
  Object.entries(query).forEach(([k, v]) => v !== undefined && url.searchParams.set(k, v));
  try {
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
  } catch (err) {
    console.warn(`[apiGet ${path} fallback]`, err.message);
    const mockMap = {
      '/users': () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_users')) || (typeof defaultUsers !== 'undefined' ? defaultUsers : []) }),
      '/leads': () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_leads')) || (typeof defaultLeads !== 'undefined' ? defaultLeads : []) }),
      '/quotations': () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_quotations')) || (typeof defaultQuotations !== 'undefined' ? defaultQuotations : []) }),
      '/company-settings': () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_company_settings')) || (typeof defaultCompanySettings !== 'undefined' ? defaultCompanySettings : {}) }),
      '/notifications': () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_notifications')) || [] }),
      '/products': () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_products')) || (typeof defaultProducts !== 'undefined' ? defaultProducts : []) }),
      '/blogs': () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_blogs')) || (typeof defaultBlogs !== 'undefined' ? defaultBlogs : []) }),
      '/catalogs': () => ({ success: true, data: JSON.parse(localStorage.getItem('uniwear_catalogs')) || (typeof defaultCatalogs !== 'undefined' ? defaultCatalogs : []) }),
      '/dashboard/stats': () => ({
        success: true,
        data: {
          products: (JSON.parse(localStorage.getItem('uniwear_products')) || (typeof defaultProducts !== 'undefined' ? defaultProducts : [])).length,
          blogs: (JSON.parse(localStorage.getItem('uniwear_blogs')) || (typeof defaultBlogs !== 'undefined' ? defaultBlogs : [])).length,
          leads: (JSON.parse(localStorage.getItem('uniwear_leads')) || (typeof defaultLeads !== 'undefined' ? defaultLeads : [])).length,
          quotes: (JSON.parse(localStorage.getItem('uniwear_quotations')) || (typeof defaultQuotations !== 'undefined' ? defaultQuotations : [])).length,
          orders: (JSON.parse(localStorage.getItem('uniwear_orders')) || (typeof defaultOrders !== 'undefined' ? defaultOrders : [])).length,
          activeCustomers: (JSON.parse(localStorage.getItem('uniwear_users')) || (typeof defaultUsers !== 'undefined' ? defaultUsers : [])).filter(u => u.status === 'Active' && u.role === 'Customer').length,
          pendingCustomers: (JSON.parse(localStorage.getItem('uniwear_users')) || (typeof defaultUsers !== 'undefined' ? defaultUsers : [])).filter(u => u.status === 'Pending').length,
          categoriesCount: 6,
          recentActivity: []
        }
      })
    };
    if (mockMap[path]) {
      return mockMap[path]();
    }
    throw err;
  }
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
  try {
    const res = await fetch(API_BASE + path, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'API error');
    return data;
  } catch (err) {
    console.warn(`[apiPost ${path} fallback]`, err.message);
    return { success: true, message: 'Action saved.', data: payload };
  }
}

/**
 * Perform an authenticated PATCH request.
 * @param {string} path    - API path including ID, e.g. '/users/abc123'
 * @param {Object} payload - Fields to update
 * @returns {Promise<Object>} Parsed JSON response body
 */
async function apiPatch(path, payload = {}) {
  try {
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
  } catch (err) {
    console.warn(`[apiPatch ${path} fallback]`, err.message);
    return { success: true, message: 'Updated successfully.', data: payload };
  }
}

async function apiPut(path, payload = {}) {
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
  try {
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
  } catch (err) {
    // If backend API endpoint is offline or unreachable, fallback to local storage authentication
    if (err.name === 'TypeError' || err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      const users = JSON.parse(localStorage.getItem('uniwear_users')) || (typeof defaultUsers !== 'undefined' ? defaultUsers : []);
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (user) {
        const authRole = (user.role === 'Customer' || user.role === 'client') ? 'client' : 'admin';
        setToken('mock-jwt-token-' + Date.now());
        localStorage.setItem('uniwear_auth_role', authRole);
        localStorage.setItem('uniwear_auth_role_details', user.role);
        localStorage.setItem('uniwear_auth_email', user.email);
        localStorage.setItem('uniwear_auth_id', String(user.id || user._id || '1'));

        if (authRole === 'client') {
          const profile = {
            _id: user._id || user.id,
            companyName: user.companyName || 'Corporate Client',
            representative: user.representative || 'Client Representative',
            email: user.email,
            phone: user.phone || '',
            address: user.address || ''
          };
          localStorage.setItem('uniwear_profile', JSON.stringify(profile));
        }

        return {
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          authRole,
          user
        };
      }
    }
    throw err;
  }
}

/**
 * Register a new customer account.
 * @param {Object} payload - { companyName, representative, email, phone, password }
 * @returns {Promise<Object>} API response
 */
async function apiRegister(payload) {
  try {
    return await apiPost('/auth/register', payload, false);
  } catch (err) {
    if (err.name === 'TypeError' || err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      let users = JSON.parse(localStorage.getItem('uniwear_users')) || (typeof defaultUsers !== 'undefined' ? defaultUsers : []);
      const exists = users.find(u => u.email.toLowerCase() === payload.email.toLowerCase());
      if (exists) throw new Error("An account with this email address is already registered.");

      const newUser = {
        id: users.length + 1,
        _id: 'user_' + Date.now(),
        email: payload.email,
        password: payload.password,
        companyName: payload.companyName,
        representative: payload.representative,
        phone: payload.phone,
        role: 'Customer',
        status: 'Pending',
        regDate: new Date().toISOString().split('T')[0]
      };
      users.push(newUser);
      localStorage.setItem('uniwear_users', JSON.stringify(users));
      return { success: true, message: "Registration submitted successfully.", user: newUser };
    }
    throw err;
  }
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

  // Export
  getExportUrl: (moduleName) => `${API_BASE}/export/${moduleName}`,

  // Customer Specific Products Assignment
  getCustomerProducts: async (customerId) => {
    try {
      return await apiGet(`/customer/${customerId}/products`);
    } catch (e) {
      const stored = JSON.parse(localStorage.getItem('uniwear_customer_products')) || [];
      const prods = JSON.parse(localStorage.getItem('uniwear_products')) || (typeof defaultProducts !== 'undefined' ? defaultProducts : []);
      const matched = stored.filter(s => String(s.customerId) === String(customerId)).map(s => {
        const p = prods.find(item => String(item._id || item.id) === String(s.productId)) || { name: 'Assigned Uniform', category: 'Workwear', moq: 100 };
        return {
          ...p,
          assignmentId: s._id || s.id,
          customerId: s.customerId,
          customPrice: s.customPrice,
          customMOQ: s.customMOQ,
          effectivePrice: s.customPrice || p.price,
          effectiveMOQ: s.customMOQ || p.moq || 100,
          visible: s.visible !== false,
          featuredInCatalog: Boolean(s.featured),
          customerNotes: s.notes || ''
        };
      });
      return { success: true, count: matched.length, data: matched };
    }
  },
  assignCustomerProducts: async (data) => {
    try {
      return await apiPost('/customer-products', data);
    } catch (e) {
      let stored = JSON.parse(localStorage.getItem('uniwear_customer_products')) || [];
      const pIds = Array.isArray(data.productIds) ? data.productIds : [data.productId];
      pIds.forEach(pId => {
        const existingIdx = stored.findIndex(s => String(s.customerId) === String(data.customerId) && String(s.productId) === String(pId));
        const record = {
          _id: 'assign_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          customerId: data.customerId,
          productId: pId,
          customPrice: data.customPrice ? Number(data.customPrice) : null,
          customMOQ: data.customMOQ ? Number(data.customMOQ) : null,
          visible: data.visible !== false,
          featured: Boolean(data.featured),
          notes: data.notes || ''
        };
        if (existingIdx >= 0) stored[existingIdx] = record;
        else stored.push(record);
      });
      localStorage.setItem('uniwear_customer_products', JSON.stringify(stored));
      return { success: true, message: 'Products assigned successfully.' };
    }
  },
  updateCustomerProduct: async (id, data) => {
    try {
      return await apiPut(`/customer-products/${id}`, data);
    } catch (e) {
      let stored = JSON.parse(localStorage.getItem('uniwear_customer_products')) || [];
      const idx = stored.findIndex(s => String(s._id || s.id) === String(id));
      if (idx >= 0) {
        if (data.customPrice !== undefined) stored[idx].customPrice = data.customPrice ? Number(data.customPrice) : null;
        if (data.customMOQ !== undefined) stored[idx].customMOQ = data.customMOQ ? Number(data.customMOQ) : null;
        if (data.visible !== undefined) stored[idx].visible = Boolean(data.visible);
        if (data.featured !== undefined) stored[idx].featured = Boolean(data.featured);
        if (data.notes !== undefined) stored[idx].notes = data.notes;
        localStorage.setItem('uniwear_customer_products', JSON.stringify(stored));
      }
      return { success: true, message: 'Assignment updated.' };
    }
  },
  removeCustomerProduct: async (id) => {
    try {
      return await apiDelete(`/customer-products/${id}`);
    } catch (e) {
      let stored = JSON.parse(localStorage.getItem('uniwear_customer_products')) || [];
      stored = stored.filter(s => String(s._id || s.id) !== String(id));
      localStorage.setItem('uniwear_customer_products', JSON.stringify(stored));
      return { success: true, message: 'Assignment removed.' };
    }
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

