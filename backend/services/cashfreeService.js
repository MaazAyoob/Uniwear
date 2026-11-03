const crypto = require('crypto');

const CASHFREE_ENV = process.env.CASHFREE_ENV || 'sandbox';
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';
const CASHFREE_API_VERSION = process.env.CASHFREE_API_VERSION || '2023-08-01';

const BASE_URL = CASHFREE_ENV === 'production'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

// Check if live Cashfree Sandbox credentials are configured
function isConfigured() {
  return Boolean(CASHFREE_APP_ID && CASHFREE_SECRET_KEY && !CASHFREE_APP_ID.includes('YOUR_'));
}

/**
 * Create a Cashfree PG Order
 * @param {Object} params { orderId, orderAmount, customerId, customerName, customerEmail, customerPhone, returnUrl, notifyUrl }
 */
async function createOrder(params) {
  const {
    orderId,
    orderAmount,
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    returnUrl,
    notifyUrl
  } = params;

  // If live credentials are not set, provide simulated sandbox session for local test suite
  if (!isConfigured()) {
    console.warn('[Cashfree Service] Live sandbox credentials not configured in .env. Running local simulator mode.');
    return {
      cf_order_id: `CF_SIM_${Date.now()}`,
      order_id: orderId,
      entity: 'order',
      order_currency: 'INR',
      order_amount: orderAmount,
      order_status: 'ACTIVE',
      payment_session_id: `session_sim_${orderId}_${Date.now()}`,
      isSimulation: true
    };
  }

  const endpoint = `${BASE_URL}/orders`;
  const body = {
    order_id: orderId,
    order_amount: Number(orderAmount.toFixed(2)),
    order_currency: 'INR',
    customer_details: {
      customer_id: String(customerId).substring(0, 50),
      customer_email: customerEmail,
      customer_phone: customerPhone ? customerPhone.replace(/[^0-9]/g, '').slice(-10) : '9999999999',
      customer_name: customerName || 'Corporate Client'
    },
    order_meta: {
      return_url: returnUrl,
      notify_url: notifyUrl
    },
    order_note: 'UNIWEAR Client Portal Order'
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
      'x-api-version': CASHFREE_API_VERSION
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Cashfree Error (${response.status}): ${data.message || JSON.stringify(data)}`);
  }

  return data;
}

/**
 * Fetch Order details from Cashfree PG
 * @param {string} orderId
 */
async function getOrder(orderId) {
  if (!isConfigured()) {
    return {
      order_id: orderId,
      order_status: 'PAID',
      isSimulation: true
    };
  }

  const endpoint = `${BASE_URL}/orders/${orderId}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
      'x-api-version': CASHFREE_API_VERSION
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Cashfree Fetch Error: ${data.message || JSON.stringify(data)}`);
  }

  return data;
}

/**
 * Fetch Payments list for an Order from Cashfree PG
 * @param {string} orderId
 */
async function getOrderPayments(orderId) {
  if (!isConfigured()) {
    return [{
      payment_status: 'SUCCESS',
      cf_payment_id: `PAY_SIM_${Date.now()}`,
      payment_amount: 0,
      payment_method: 'upi',
      isSimulation: true
    }];
  }

  const endpoint = `${BASE_URL}/orders/${orderId}/payments`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
      'x-api-version': CASHFREE_API_VERSION
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Cashfree Payments Fetch Error: ${data.message || JSON.stringify(data)}`);
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Verify Webhook Signature using HMAC-SHA256
 * @param {string} rawBody
 * @param {string} signature
 * @param {string} timestamp
 */
function verifyWebhookSignature(rawBody, signature, timestamp) {
  if (!isConfigured()) {
    // Simulator passes signature verification in local development
    return true;
  }
  if (!signature || !timestamp) return false;

  const dataToSign = `${timestamp}${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', CASHFREE_SECRET_KEY)
    .update(dataToSign)
    .digest('base64');

  try {
    return crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));
  } catch (err) {
    return false;
  }
}

module.exports = {
  isConfigured,
  createOrder,
  getOrder,
  getOrderPayments,
  verifyWebhookSignature,
  CASHFREE_ENV
};
