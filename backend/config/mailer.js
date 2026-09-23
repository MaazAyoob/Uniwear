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
const sendMail = async ({ to, cc, subject, html, eventName = 'General Notification' }) => {
  const timestamp = new Date().toISOString();
  if (!process.env.EMAIL_USER) {
    console.log('[Mailer] Email status update');
    console.log(`Recipient: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Event Name: ${eventName}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log('Status: Success (Console Dry-Run)');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"UNIWEAR Portal System" <${process.env.EMAIL_USER}>`,
      to,
      cc: cc || undefined,
      subject,
      html
    });
    console.log('[Mailer] Email status update');
    console.log(`Recipient: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Event Name: ${eventName}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log('Status: Success');
  } catch (err) {
    console.error('[Mailer] Email status update');
    console.error(`Recipient: ${to}`);
    console.error(`Subject: ${subject}`);
    console.error(`Event Name: ${eventName}`);
    console.error(`Timestamp: ${timestamp}`);
    console.error('Status: Failure');
    console.error(`Error details: ${err.message}`);
  }
};

// ─── Base HTML Email Layout Wrapper ───────────────────────────────────────────

const wrapEmail = (title, content, settings = {}) => {
  const primaryColor = '#B91C1C';
  const companyName = settings.companyName || 'UNIWEAR';
  const supportEmail = settings.supportEmail || 'connect@uniwear.co';
  const phone = settings.phone || '+91 91087 65831';
  const address = settings.address || 'No 121/A, 1st Floor, 27th Cross Road, 7th Block, Jayanagar, Bengaluru - 560070';
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #F9FAFB; color: #111827; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
    .wrapper { width: 100%; table-layout: fixed; background-color: #F9FAFB; padding: 40px 0; }
    .container { max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid rgba(0, 0, 0, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: #FFFFFF; padding: 32px; text-align: center; border-bottom: 1px solid rgba(0, 0, 0, 0.05); }
    .body { padding: 40px 32px; line-height: 1.6; }
    .footer { background-color: #111827; color: #9CA3AF; padding: 32px; text-align: center; font-size: 12px; line-height: 1.8; }
    .footer a { color: #FFFFFF; text-decoration: none; font-weight: bold; }
    .button { display: inline-block; background-color: ${primaryColor}; color: #FFFFFF !important; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 30px; margin: 20px 0; text-transform: uppercase; font-size: 12px; letter-spacing: 0.05em; }
    .table-data { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .table-data td { padding: 12px; border-bottom: 1px solid #F3F4F6; font-size: 14px; }
    .table-data td:first-child { font-weight: bold; color: #4B5563; width: 180px; }
    blockquote { background-color: #F3F4F6; padding: 16px; border-left: 4px solid ${primaryColor}; margin: 20px 0; font-style: italic; }
  </style>
</head>
<body>
  <table class="wrapper" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <table class="container" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td class="header">
              <h2 style="margin: 0; color: ${primaryColor}; font-family: sans-serif; font-size: 24px; letter-spacing: 1px; font-weight: 800;">UNIWEAR</h2>
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #6B7280; margin-top: 4px;">Premium Workwear Partner</div>
            </td>
          </tr>
          <tr>
            <td class="body">
              ${content}
            </td>
          </tr>
          <tr>
            <td class="footer">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #FFFFFF;">${companyName} Enterprise Workwear</p>
              <p style="margin: 0 0 16px 0;">${address}</p>
              <p style="margin: 0 0 16px 0;">Phone: ${phone} | Email: <a href="mailto:${supportEmail}">${supportEmail}</a></p>
              <p style="margin: 0; font-size: 11px; color: #6B7280;">Copyright &copy; 2026 ${companyName}. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// ─── Email Templates ──────────────────────────────────────────────────────────

const emailTemplates = {
  // 1. Contact Form
  newLead: (lead, settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: 'New Website Enquiry - UNIWEAR',
    eventName: 'Contact Form Submission',
    html: wrapEmail(
      'New Website Enquiry - UNIWEAR',
      `
      <h2 style="color:#B91C1C; margin-top:0;">New Lead Captured</h2>
      <p>A new customer enquiry has been submitted from the website:</p>
      <table class="table-data">
        <tr><td>Name</td><td>${lead.name}</td></tr>
        <tr><td>Company</td><td>${lead.company || 'N/A'}</td></tr>
        <tr><td>Email</td><td>${lead.email || 'N/A'}</td></tr>
        <tr><td>Phone</td><td>${lead.phone || 'N/A'}</td></tr>
        <tr><td>Category</td><td>${lead.category}</td></tr>
        <tr><td>Quantity</td><td>${lead.volume} Sets</td></tr>
        <tr><td>Message</td><td>${lead.details || 'N/A'}</td></tr>
        <tr><td>Date & Time</td><td>${lead.date || new Date().toISOString().split('T')[0]}</td></tr>
      </table>
      `,
      settings
    )
  }),

  // 2. Design Studio
  designStudio: (lead, customizations = {}, settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: 'New Design Studio Consultation Request',
    eventName: 'Design Studio Request',
    html: wrapEmail(
      'New Design Studio Consultation Request',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Design Studio Request</h2>
      <p>A new custom design configuration has been submitted:</p>
      <table class="table-data">
        <tr><td>Product</td><td>${lead.productName || 'N/A'}</td></tr>
        <tr><td>Category</td><td>${lead.category || 'N/A'}</td></tr>
        <tr><td>Fabric</td><td>${customizations.fabric || 'N/A'}</td></tr>
        <tr><td>Primary Color</td><td>${customizations.primaryColor || 'N/A'}</td></tr>
        <tr><td>Secondary Color</td><td>${customizations.secondaryColor || 'N/A'}</td></tr>
        <tr><td>Branding Type</td><td>${customizations.brandingType || 'N/A'}</td></tr>
        <tr><td>Branding Position</td><td>${customizations.logoPosition || 'N/A'}</td></tr>
        <tr><td>Quantity</td><td>${lead.volume} Sets</td></tr>
        <tr><td>Timeline</td><td>${lead.timeline || 'N/A'}</td></tr>
        <tr><td>Name</td><td>${lead.name}</td></tr>
        <tr><td>Company</td><td>${lead.company || 'N/A'}</td></tr>
        <tr><td>Email</td><td>${lead.email || 'N/A'}</td></tr>
        <tr><td>Phone</td><td>${lead.phone || 'N/A'}</td></tr>
      </table>
      `,
      settings
    )
  }),

  // 3. Customer Registration (Admin Copy)
  registrationAdmin: (user, settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: 'New Customer Registration',
    eventName: 'Customer Registration Alert (Admin)',
    html: wrapEmail(
      'New Customer Registration',
      `
      <h2 style="color:#B91C1C; margin-top:0;">New Customer Registration</h2>
      <p>A new B2B customer registration request has been received:</p>
      <table class="table-data">
        <tr><td>Company</td><td>${user.companyName}</td></tr>
        <tr><td>Contact Person</td><td>${user.representative}</td></tr>
        <tr><td>Email</td><td>${user.email}</td></tr>
        <tr><td>Phone</td><td>${user.phone}</td></tr>
      </table>
      `,
      settings
    )
  }),

  // 3. Customer Registration (Customer Copy)
  registrationCustomer: (user, settings = {}) => ({
    to: user.email,
    subject: 'Registration Received',
    eventName: 'Customer Registration Confirmation',
    html: wrapEmail(
      'Registration Received',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Registration Confirmed</h2>
      <p>Dear ${user.representative},</p>
      <p>Thank you for registering with <b>UNIWEAR</b>. Your account request for <b>${user.companyName}</b> has been received and is currently <b>Pending Administrator Approval</b>.</p>
      <p>Our operations hub will review your registration details shortly and get in touch with you.</p>
      `,
      settings
    )
  }),

  // 4. Customer Approval
  userApproved: (user, settings = {}) => ({
    to: user.email,
    subject: 'Your UNIWEAR Account Has Been Approved',
    eventName: 'Customer Approval Notification',
    html: wrapEmail(
      'Your UNIWEAR Account Has Been Approved',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Account Approved</h2>
      <p>Dear ${user.representative},</p>
      <p>Your <b>UNIWEAR</b> customer portal account for <b>${user.companyName}</b> has been approved.</p>
      <p>You can now log in using your registered credentials to track quotes, orders, and support requests.</p>
      <p style="text-align:center;">
        <a href="https://uniwear.co/login.html" class="button">Access Customer Portal</a>
      </p>
      `,
      settings
    )
  }),

  // 5. Customer Rejection
  userRejected: (user, settings = {}) => ({
    to: user.email,
    subject: 'Your UNIWEAR Registration Status',
    eventName: 'Customer Rejection Notification',
    html: wrapEmail(
      'Your UNIWEAR Registration Status',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Registration Declined</h2>
      <p>Dear ${user.representative || 'Customer'},</p>
      <p>Thank you for your interest in B2B procurement with <b>UNIWEAR</b>.</p>
      <p>We regret to inform you that your registration request for <b>${user.companyName || 'your company'}</b> has been declined by our administration team.</p>
      <p>If you believe this was an error or wish to provide more details, please contact support.</p>
      `,
      settings
    )
  }),

  // 7. Chatbot Human Handoff
  chatbotHandoff: (lead, settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: 'New Chatbot Human Handoff Request',
    eventName: 'Chatbot Human Handoff',
    html: wrapEmail(
      'New Chatbot Human Handoff Request',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Chatbot Handoff Request</h2>
      <p>A customer has requested escalation to a human agent:</p>
      <table class="table-data">
        <tr><td>Name</td><td>${lead.name}</td></tr>
        <tr><td>Company</td><td>${lead.company || 'N/A'}</td></tr>
        <tr><td>Email</td><td>${lead.email || 'N/A'}</td></tr>
        <tr><td>Phone</td><td>${lead.phone || 'N/A'}</td></tr>
        <tr><td>Conversation Summary</td><td>${lead.details || 'N/A'}</td></tr>
      </table>
      `,
      settings
    )
  }),

  // 8. Quotation Created
  quotationCreated: (quotation, settings = {}) => ({
    to: quotation.clientEmail,
    subject: 'New Quotation Created - UNIWEAR',
    eventName: 'Quotation Created',
    html: wrapEmail(
      'New Quotation Created - UNIWEAR',
      `
      <h2 style="color:#B91C1C; margin-top:0;">New Quotation Available</h2>
      <p>Dear Client,</p>
      <p>A new quotation has been generated for your review:</p>
      <table class="table-data">
        <tr><td>Quotation ID</td><td>${quotation.id}</td></tr>
        <tr><td>Product Category</td><td>${quotation.productClass}</td></tr>
        <tr><td>Volume</td><td>${quotation.volume} Sets</td></tr>
        <tr><td>Total Amount</td><td>${quotation.value}</td></tr>
        <tr><td>Specs/Notes</td><td>${quotation.specs || 'N/A'}</td></tr>
      </table>
      <p>Please log in to the portal to approve or request revisions.</p>
      <p style="text-align:center;">
        <a href="https://uniwear.co/login.html" class="button">Review Quotation</a>
      </p>
      `,
      settings
    )
  }),

  // 8b. Quotation Requested (Admin Alert)
  quotationRequestedAdmin: (quotation, settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: 'New Quotation Request Submitted - UNIWEAR',
    eventName: 'Quotation Request Received',
    html: wrapEmail(
      'New Quotation Request - UNIWEAR',
      `
      <h2 style="color:#B91C1C; margin-top:0;">New Quotation Request</h2>
      <p>A B2B client has submitted a new quotation request:</p>
      <table class="table-data">
        <tr><td>Quotation ID</td><td>${quotation.id}</td></tr>
        <tr><td>Client Email</td><td>${quotation.clientEmail}</td></tr>
        <tr><td>Product Category</td><td>${quotation.productClass}</td></tr>
        <tr><td>Volume</td><td>${quotation.volume} Sets</td></tr>
        <tr><td>Target Price/Value</td><td>${quotation.value || 'Pending Admin Estimation'}</td></tr>
        <tr><td>Specifications</td><td>${quotation.specs || 'N/A'}</td></tr>
        <tr><td>Request Date</td><td>${quotation.date || new Date().toISOString().split('T')[0]}</td></tr>
      </table>
      <p>Please log in to the admin portal to review, price, and publish the proposal details.</p>
      `,
      settings
    )
  }),

  // 9. Quotation Revised
  quotationRevised: (quotation, settings = {}) => ({
    to: quotation.clientEmail,
    subject: 'Quotation Revised - UNIWEAR',
    eventName: 'Quotation Revised',
    html: wrapEmail(
      'Quotation Revised - UNIWEAR',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Quotation Revised</h2>
      <p>Dear Client,</p>
      <p>Your quotation has been revised by the administrator:</p>
      <table class="table-data">
        <tr><td>Quotation ID</td><td>${quotation.id}</td></tr>
        <tr><td>Product Category</td><td>${quotation.productClass}</td></tr>
        <tr><td>Volume</td><td>${quotation.volume} Sets</td></tr>
        <tr><td>Total Amount</td><td>${quotation.value}</td></tr>
        <tr><td>Specs/Notes</td><td>${quotation.specs || 'N/A'}</td></tr>
      </table>
      <p>Please log in to review the revised terms.</p>
      <p style="text-align:center;">
        <a href="https://uniwear.co/login.html" class="button">Review Quotation</a>
      </p>
      `,
      settings
    )
  }),

  // 10. Quotation Approved
  quotationApproved: (quotation, user, settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: 'Quotation Approved by Customer',
    eventName: 'Quotation Approved',
    html: wrapEmail(
      'Quotation Approved by Customer',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Quotation Approved</h2>
      <p>A customer has approved their quotation:</p>
      <table class="table-data">
        <tr><td>Customer</td><td>${user ? user.representative : 'N/A'}</td></tr>
        <tr><td>Company</td><td>${user ? user.companyName : 'N/A'}</td></tr>
        <tr><td>Quotation ID</td><td>${quotation.id}</td></tr>
        <tr><td>Product</td><td>${quotation.productClass}</td></tr>
        <tr><td>Value</td><td>${quotation.value}</td></tr>
        <tr><td>Approval Date</td><td>${new Date().toLocaleDateString('en-IN')}</td></tr>
      </table>
      `,
      settings
    )
  }),

  // 11. Order Created (Customer Copy)
  orderCreatedCustomer: (order, settings = {}) => ({
    to: order.clientEmail,
    subject: 'Order Confirmation - UNIWEAR',
    eventName: 'Order Created Confirmation',
    html: wrapEmail(
      'Order Confirmation - UNIWEAR',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Order Logged</h2>
      <p>Dear Client,</p>
      <p>Your order has been successfully generated and logged in our production system:</p>
      <table class="table-data">
        <tr><td>Order Number</td><td>${order.id}</td></tr>
        <tr><td>Product</td><td>${order.productName}</td></tr>
        <tr><td>Volume</td><td>${order.volume} Sets</td></tr>
        <tr><td>Value</td><td>${order.value}</td></tr>
        <tr><td>Production Status</td><td>${order.statusText}</td></tr>
        <tr><td>Estimated Delivery</td><td>${order.deliveryDate}</td></tr>
      </table>
      <p>You can track the live progress and stitching cycle in your portal.</p>
      <p style="text-align:center;">
        <a href="https://uniwear.co/login.html" class="button">Track Order</a>
      </p>
      `,
      settings
    )
  }),

  // 11. Order Created (Admin Copy)
  orderCreatedAdmin: (order, settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: 'New Order Created - UNIWEAR',
    eventName: 'New Order Registered Alert',
    html: wrapEmail(
      'New Order Created - UNIWEAR',
      `
      <h2 style="color:#B91C1C; margin-top:0;">New Order Registered</h2>
      <p>A new order has been generated in the system:</p>
      <table class="table-data">
        <tr><td>Order ID</td><td>${order.id}</td></tr>
        <tr><td>Client Email</td><td>${order.clientEmail}</td></tr>
        <tr><td>Product</td><td>${order.productName}</td></tr>
        <tr><td>Volume</td><td>${order.volume} Sets</td></tr>
        <tr><td>Value</td><td>${order.value}</td></tr>
      </table>
      `,
      settings
    )
  }),

  // 12. Order Status Updates
  orderStatusUpdate: (order, settings = {}) => ({
    to: order.clientEmail,
    subject: 'Order Status Update - UNIWEAR',
    eventName: 'Order Status Updated',
    html: wrapEmail(
      'Order Status Update - UNIWEAR',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Order Status Update</h2>
      <p>Dear Client,</p>
      <p>The production status of your order <b>${order.id}</b> has been updated:</p>
      <table class="table-data">
        <tr><td>Order ID</td><td>${order.id}</td></tr>
        <tr><td>Current Stage</td><td>Step ${order.statusStep}/5: ${order.statusText}</td></tr>
        <tr><td>Estimated Delivery</td><td>${order.deliveryDate}</td></tr>
      </table>
      <p>Please log in to see detailed inspection sheets and quality control stamps.</p>
      <p style="text-align:center;">
        <a href="https://uniwear.co/login.html" class="button">View Order Progress</a>
      </p>
      `,
      settings
    )
  }),

  // 13. Sample Request
  sampleRequest: (lead, settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: 'New Sample Request - UNIWEAR',
    eventName: 'Sample Request Alert',
    html: wrapEmail(
      'New Sample Request - UNIWEAR',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Sample Request</h2>
      <p>A client has requested fabric/fit samples:</p>
      <table class="table-data">
        <tr><td>Customer</td><td>${lead.name}</td></tr>
        <tr><td>Company</td><td>${lead.company || 'N/A'}</td></tr>
        <tr><td>Email</td><td>${lead.email || 'N/A'}</td></tr>
        <tr><td>Phone</td><td>${lead.phone || 'N/A'}</td></tr>
        <tr><td>Requested Items</td><td>${lead.details}</td></tr>
        <tr><td>Date</td><td>${lead.date || new Date().toISOString().split('T')[0]}</td></tr>
      </table>
      `,
      settings
    )
  }),

  // 14. Support Ticket Created
  supportTicketCreated: (ticket, settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: 'New Support Ticket Created',
    eventName: 'Support Ticket Created',
    html: wrapEmail(
      'New Support Ticket Created',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Support Ticket Opened</h2>
      <p>A new support ticket has been opened by a client:</p>
      <table class="table-data">
        <tr><td>Ticket ID</td><td>${ticket.id}</td></tr>
        <tr><td>Subject</td><td>${ticket.subject}</td></tr>
        <tr><td>Category</td><td>${ticket.category}</td></tr>
        <tr><td>Priority</td><td>${ticket.priority || 'Medium'}</td></tr>
        <tr><td>Client Email</td><td>${ticket.clientEmail}</td></tr>
      </table>
      `,
      settings
    )
  }),

  // 15. Customer Replies
  customerReplyNotification: (ticket, messageText, settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: `New Customer Reply on Ticket ${ticket.id}`,
    eventName: 'Customer Ticket Reply',
    html: wrapEmail(
      `New Customer Reply on Ticket ${ticket.id}`,
      `
      <h2 style="color:#B91C1C; margin-top:0;">New Ticket Reply</h2>
      <p>A customer has replied to support ticket <b>${ticket.id}</b>:</p>
      <blockquote>
        ${messageText}
      </blockquote>
      `,
      settings
    )
  }),

  // 16. Admin Replies
  adminReplyNotification: (ticket, messageText, settings = {}) => ({
    to: ticket.clientEmail,
    subject: `Update on your Support Ticket ${ticket.id}`,
    eventName: 'Admin Ticket Reply',
    html: wrapEmail(
      `Update on your Support Ticket ${ticket.id}`,
      `
      <h2 style="color:#B91C1C; margin-top:0;">Support Agent Reply</h2>
      <p>Our support team has replied to support ticket <b>${ticket.id}</b>:</p>
      <blockquote>
        ${messageText}
      </blockquote>
      <p>Please log in to your portal to respond or close the ticket.</p>
      <p style="text-align:center;">
        <a href="https://uniwear.co/login.html" class="button">Go to Support Portal</a>
      </p>
      `,
      settings
    )
  }),

  // 17. Ticket Closed
  ticketClosed: (ticket, settings = {}) => ({
    to: ticket.clientEmail,
    subject: 'Support Ticket Closed',
    eventName: 'Ticket Closed Notification',
    html: wrapEmail(
      'Support Ticket Closed',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Ticket Resolved</h2>
      <p>Dear Client,</p>
      <p>Support ticket <b>${ticket.id}</b> has been marked as <b>Closed/Resolved</b> by the administrator.</p>
      <p>If your issue is not resolved, you can log in to open a new support request.</p>
      `,
      settings
    )
  }),

  // 18. Password Reset
  passwordReset: (user, settings = {}) => ({
    to: user.email,
    subject: 'Your UNIWEAR Password Has Been Updated',
    eventName: 'Password Update Notification',
    html: wrapEmail(
      'Your UNIWEAR Password Has Been Updated',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Security Alert: Password Updated</h2>
      <p>Dear ${user.representative || 'Customer'},</p>
      <p>This is to inform you that your password for the UNIWEAR customer portal has been successfully updated.</p>
      <p>If you did not request this update, please contact the administrator immediately at <a href="mailto:${settings.supportEmail || 'connect@uniwear.co'}">${settings.supportEmail || 'connect@uniwear.co'}</a>.</p>
      `,
      settings
    )
  }),

  // 19. Company Settings Change
  settingsUpdated: (settings = {}) => ({
    to: settings.notificationEmail,
    cc: settings.ccEmail || undefined,
    subject: 'System Settings Updated',
    eventName: 'System Settings Changed Alert',
    html: wrapEmail(
      'System Settings Updated',
      `
      <h2 style="color:#B91C1C; margin-top:0;">Company Profile Changed</h2>
      <p>This is an automated notification confirming that the branding/company settings have been updated on the admin dashboard.</p>
      `,
      settings
    )
  })
};

module.exports = { sendMail, emailTemplates };
