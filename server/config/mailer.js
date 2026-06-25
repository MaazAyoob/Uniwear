const nodemailer = require('nodemailer');

// Build transporter from environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});

/**
 * Send an email via Nodemailer.
 * Falls back to console.log if credentials are not configured.
 *
 * @param {Object} options
 * @param {string} options.to         Recipient email address
 * @param {string} options.cc         CC email address (optional)
 * @param {string} options.subject    Email subject line
 * @param {string} options.html       HTML body
 */
const sendMail = async ({ to, cc, subject, html }) => {
  // If no EMAIL_USER is configured, log to console only
  if (!process.env.EMAIL_USER) {
    console.log('[Mailer] No SMTP credentials configured. Email would have been sent:');
    console.log(`  To: ${to}`);
    if (cc) console.log(`  CC: ${cc}`);
    console.log(`  Subject: ${subject}`);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: `"UNIWEAR Portal System" <${process.env.EMAIL_USER}>`,
      to,
      cc: cc || undefined,
      subject,
      html
    });
    console.log(`[Mailer] Email sent: ${info.messageId}`);
  } catch (err) {
    console.error('[Mailer] Send error:', err.message);
  }
};

// ─── Email Templates ──────────────────────────────────────────────────────────

const emailTemplates = {
  newLead: (lead, settings = {}) => ({
    to: settings.notificationEmail || 'connect@uniwear.co',
    cc: settings.ccEmail || undefined,
    subject: 'New Website Enquiry - UNIWEAR',
    html: `
      <h2 style="color:#B91C1C">New Lead Captured</h2>
      <table cellpadding="6" style="border-collapse:collapse;width:100%">
        <tr><td><b>Name</b></td><td>${lead.name}</td></tr>
        <tr><td><b>Company</b></td><td>${lead.company}</td></tr>
        <tr><td><b>Email</b></td><td>${lead.email}</td></tr>
        <tr><td><b>Phone</b></td><td>${lead.phone}</td></tr>
        <tr><td><b>Category</b></td><td>${lead.category}</td></tr>
        <tr><td><b>Quantity</b></td><td>${lead.volume}</td></tr>
        <tr><td><b>Message</b></td><td>${lead.details || 'N/A'}</td></tr>
        <tr><td><b>Date</b></td><td>${lead.date}</td></tr>
      </table>
    `
  }),

  designStudio: (lead, settings = {}) => ({
    to: settings.notificationEmail || 'connect@uniwear.co',
    cc: settings.ccEmail || undefined,
    subject: 'New Design Studio Consultation Request',
    html: `
      <h2 style="color:#B91C1C">Design Studio Request</h2>
      <table cellpadding="6" style="border-collapse:collapse;width:100%">
        <tr><td><b>Name</b></td><td>${lead.name}</td></tr>
        <tr><td><b>Company</b></td><td>${lead.company}</td></tr>
        <tr><td><b>Email</b></td><td>${lead.email}</td></tr>
        <tr><td><b>Phone</b></td><td>${lead.phone}</td></tr>
        <tr><td><b>Details</b></td><td>${lead.details}</td></tr>
      </table>
    `
  }),

  registrationAdmin: (user, settings = {}) => ({
    to: settings.notificationEmail || 'connect@uniwear.co',
    cc: settings.ccEmail || undefined,
    subject: 'New Customer Registration Request',
    html: `
      <h2 style="color:#B91C1C">New Registration Received</h2>
      <table cellpadding="6" style="border-collapse:collapse;width:100%">
        <tr><td><b>Company</b></td><td>${user.companyName}</td></tr>
        <tr><td><b>Contact Person</b></td><td>${user.representative}</td></tr>
        <tr><td><b>Email</b></td><td>${user.email}</td></tr>
        <tr><td><b>Phone</b></td><td>${user.phone}</td></tr>
        <tr><td><b>Status</b></td><td>Pending Approval</td></tr>
      </table>
    `
  }),

  registrationCustomer: (user, settings = {}) => ({
    to: user.email,
    subject: 'UNIWEAR Registration Received',
    html: `
      <h2 style="color:#B91C1C">Registration Confirmed</h2>
      <p>Dear ${user.representative},</p>
      <p>Thank you for registering with <b>UNIWEAR</b>. Your account request for <b>${user.companyName}</b> has been received and is currently <b>Pending Administrator Approval</b>.</p>
      <p>Our team will review your registration and contact you shortly.</p>
      <p style="color:#6B7280;font-size:12px">UNIWEAR Enterprise Workwear | Bengaluru</p>
    `
  }),

  userApproved: (user, settings = {}) => ({
    to: user.email,
    subject: 'UNIWEAR Account Approved',
    html: `
      <h2 style="color:#B91C1C">Account Approved</h2>
      <p>Dear ${user.representative},</p>
      <p>Your <b>UNIWEAR</b> customer portal account for <b>${user.companyName}</b> has been <b>approved</b>.</p>
      <p>You may now log in using your registered credentials at the <a href="https://yourdomain.com/login.html">UNIWEAR Portal</a>.</p>
      <p style="color:#6B7280;font-size:12px">UNIWEAR Enterprise Workwear | Bengaluru</p>
    `
  }),

  quotationApproved: (quotation, user, settings = {}) => ({
    to: settings.notificationEmail || 'connect@uniwear.co',
    cc: settings.ccEmail || undefined,
    subject: 'Quotation Approved by Customer',
    html: `
      <h2 style="color:#B91C1C">Quotation Approved</h2>
      <table cellpadding="6" style="border-collapse:collapse;width:100%">
        <tr><td><b>Customer</b></td><td>${user ? user.representative : 'N/A'}</td></tr>
        <tr><td><b>Company</b></td><td>${user ? user.companyName : 'N/A'}</td></tr>
        <tr><td><b>Quote ID</b></td><td>${quotation.id}</td></tr>
        <tr><td><b>Product</b></td><td>${quotation.productClass}</td></tr>
        <tr><td><b>Value</b></td><td>${quotation.value}</td></tr>
        <tr><td><b>Approved On</b></td><td>${new Date().toLocaleDateString('en-IN')}</td></tr>
      </table>
    `
  }),

  chatbotHandoff: (lead, settings = {}) => ({
    to: settings.notificationEmail || 'connect@uniwear.co',
    cc: settings.ccEmail || undefined,
    subject: 'New Chatbot Human Handoff Request',
    html: `
      <h2 style="color:#B91C1C">Chatbot Handoff Request</h2>
      <table cellpadding="6" style="border-collapse:collapse;width:100%">
        <tr><td><b>Name</b></td><td>${lead.name}</td></tr>
        <tr><td><b>Company</b></td><td>${lead.company}</td></tr>
        <tr><td><b>Email</b></td><td>${lead.email}</td></tr>
        <tr><td><b>Phone</b></td><td>${lead.phone}</td></tr>
        <tr><td><b>Requirement</b></td><td>${lead.details}</td></tr>
      </table>
    `
  })
};

module.exports = { sendMail, emailTemplates };
