const crypto = require('crypto');

function getAppId() {
  return process.env.CASHFREE_APP_ID || '';
}

function getSecretKey() {
  return process.env.CASHFREE_SECRET_KEY || '';
}

function getEnv() {
  return (process.env.CASHFREE_ENV || 'sandbox').toLowerCase();
}

function getApiVersion() {
  return process.env.CASHFREE_API_VERSION || '2023-08-01';
}

function getBaseUrl() {
  return getEnv() === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';
}

/**
 * Returns true if real Cashfree credentials are configured.
 */
function isConfigured() {
  const appId = getAppId();
  const secret = getSecretKey();
  return Boolean(appId && secret && !appId.includes('YOUR_') && !secret.includes('YOUR_'));
}

/**
 * Simulator safety check:
 * Simulator is STRICTLY FORBIDDEN in production environment under all circumstances.
 * In non-production, it is only active if explicitly enabled via ALLOW_PAYMENT_SIMULATOR=true.
 */
function isSimulatorAllowed() {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }
  return process.env.ALLOW_PAYMENT_SIMULATOR === 'true';
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

  if (typeof orderAmount !== 'number' || isNaN(orderAmount) || orderAmount <= 0) {
    throw new Error(`Invalid order amount: ${orderAmount}. Cashfree orders must have a positive order amount greater than 0.`);
  }

  // Fail closed if real credentials are not set and simulator is not explicitly enabled
  if (!isConfigured()) {
    if (!isSimulatorAllowed()) {
      throw new Error(
        'Cashfree gateway credentials not configured (CASHFREE_APP_ID, CASHFREE_SECRET_KEY). ' +
        'Payment gateway failed closed. (Simulator disabled: set ALLOW_PAYMENT_SIMULATOR=true in local development only).'
      );
    }

    console.warn('[Cashfree Service] Simulator mode active (ALLOW_PAYMENT_SIMULATOR=true). Providing deterministic test session.');
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

  const endpoint = `${getBaseUrl()}/orders`;
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
      'x-client-id': getAppId(),
      'x-client-secret': getSecretKey(),
      'x-api-version': getApiVersion()
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Cashfree Order Creation Error (${response.status}): ${data.message || JSON.stringify(data)}`);
  }

  return data;
}

/**
 * Fetch Order details from Cashfree PG
 * @param {string} orderId
 * @param {number} [expectedAmount] Optional expected order amount for simulator alignment
 */
async function getOrder(orderId, expectedAmount) {
  if (!isConfigured()) {
    if (!isSimulatorAllowed()) {
      throw new Error('Cashfree credentials missing. Cannot fetch gateway order.');
    }
    return {
      order_id: orderId,
      order_amount: expectedAmount || 0,
      order_currency: 'INR',
      order_status: 'PAID',
      isSimulation: true
    };
  }

  const endpoint = `${getBaseUrl()}/orders/${orderId}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'x-client-id': getAppId(),
      'x-client-secret': getSecretKey(),
      'x-api-version': getApiVersion()
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Cashfree Fetch Error (${response.status}): ${data.message || JSON.stringify(data)}`);
  }

  return data;
}

/**
 * Fetch Payments list for an Order from Cashfree PG
 * @param {string} orderId
 * @param {number} [expectedAmount] Optional expected payment amount for simulator alignment
 */
async function getOrderPayments(orderId, expectedAmount) {
  if (!isConfigured()) {
    if (!isSimulatorAllowed()) {
      throw new Error('Cashfree credentials missing. Cannot fetch gateway payments.');
    }
    return [{
      payment_status: 'SUCCESS',
      cf_payment_id: `PAY_SIM_${Date.now()}`,
      payment_amount: expectedAmount || 0,
      payment_currency: 'INR',
      payment_method: 'upi',
      isSimulation: true
    }];
  }

  const endpoint = `${getBaseUrl()}/orders/${orderId}/payments`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'x-client-id': getAppId(),
      'x-client-secret': getSecretKey(),
      'x-api-version': getApiVersion()
    }
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Cashfree Payments Fetch Error (${response.status}): ${data.message || JSON.stringify(data)}`);
  }

  return Array.isArray(data) ? data : [];
}

/**
 * Verify Webhook Signature Details using HMAC-SHA256
 * Returns { isValid, isFresh } to distinguish forged vs delayed signatures
 * @param {string} rawBody Byte-for-byte exact request payload
 * @param {string} signature Header x-webhook-signature
 * @param {string} timestamp Header x-webhook-timestamp
 */
function verifyWebhookSignatureDetails(rawBody, signature, timestamp) {
  // If not configured with real credentials:
  if (!isConfigured()) {
    if (isSimulatorAllowed() && signature === 'SIMULATED_TEST_SIGNATURE') {
      return { isValid: true, isFresh: true };
    }
    return { isValid: false, isFresh: false };
  }

  if (!signature || !timestamp || !rawBody) {
    return { isValid: false, isFresh: false };
  }

  const secretKey = getSecretKey();
  const dataToSign = `${timestamp}${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(dataToSign)
    .digest('base64');

  let isValid = false;
  try {
    const expectedBuf = Buffer.from(expectedSignature, 'utf8');
    const signatureBuf = Buffer.from(signature, 'utf8');
    if (expectedBuf.length === signatureBuf.length) {
      isValid = crypto.timingSafeEqual(expectedBuf, signatureBuf);
    }
  } catch (err) {
    isValid = false;
  }

  let isFresh = true;
  const tsNum = Number(timestamp);
  if (!isNaN(tsNum)) {
    const tsMs = tsNum > 1e11 ? tsNum : tsNum * 1000;
    const ageMs = Math.abs(Date.now() - tsMs);
    if (ageMs > 15 * 60 * 1000) {
      isFresh = false;
    }
  }

  return { isValid, isFresh };
}

/**
 * Verify Webhook Signature using HMAC-SHA256 (convenience boolean)
 * Enforces valid signature AND fresh timestamp (< 15 min)
 * @param {string} rawBody Byte-for-byte exact request payload
 * @param {string} signature Header x-webhook-signature
 * @param {string} timestamp Header x-webhook-timestamp
 */
function verifyWebhookSignature(rawBody, signature, timestamp) {
  const details = verifyWebhookSignatureDetails(rawBody, signature, timestamp);
  return details.isValid && details.isFresh;
}

/**
 * Returns the trusted client SDK mode ('production' or 'sandbox')
 * Safe for frontend consumption (exposes no credentials)
 */
function getClientSdkMode() {
  return getEnv() === 'production' ? 'production' : 'sandbox';
}

module.exports = {
  isConfigured,
  isSimulatorAllowed,
  createOrder,
  getOrder,
  getOrderPayments,
  verifyWebhookSignature,
  verifyWebhookSignatureDetails,
  getAppId,
  getSecretKey,
  getEnv,
  getClientSdkMode,
  getBaseUrl,
  getApiVersion
};
