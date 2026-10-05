const mongoose = require('mongoose');
const Product = require('../models/Product');
const Lead = require('../models/Lead');
const Notification = require('../models/Notification');
const CompanySettings = require('../models/CompanySettings');
const { sendMail, emailTemplates } = require('../config/mailer');

// ============================================================================
// UNIWEAR FULLY SELF-CONTAINED LOCAL CONVERSATIONAL INTELLIGENCE ENGINE
// ============================================================================
// Architecture:
// 1. Text Normalization & Tokenization
// 2. Levenshtein Fuzzy Matching & Typo Tolerance
// 3. Synonym Mapping & Lexicon Expansion
// 4. Intent Scoring & Classification
// 5. Entity & Slot Extraction
// 6. Context Resolution & Follow-Up Reasoning
// 7. Conversation State Tracking (Memory)
// 8. Controlled Database Product Retrieval (MongoDB)
// 9. Controlled Natural Response Generation with Contextual Variations
// 10. Genuine Lead Qualification & Creation in MongoDB (Zero Duplicates)
// 11. Strict Anti-Hallucination & Verified Factuality Guardrails
// ============================================================================

// --- 1. In-Memory Session Store with 2-Hour TTL ---
const sessions = new Map();
const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

function cleanOldSessions() {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastActive > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}
setInterval(cleanOldSessions, 30 * 60 * 1000);

function getOrCreateSession(conversationId) {
  cleanOldSessions();
  const id = conversationId && typeof conversationId === 'string' && conversationId.trim()
    ? conversationId.trim()
    : `uw_chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  if (!sessions.has(id)) {
    sessions.set(id, {
      id,
      history: [],
      slots: {
        category: null,
        item: null,
        quantity: null,
        company: null,
        name: null,
        email: null,
        phone: null,
        timeline: null,
        location: null
      },
      state: 'IDLE', // IDLE, CATEGORY_SELECTED, ITEM_SELECTED, QUANTITY_KNOWN, AWAITING_CONTACT, LEAD_CAPTURED, HANDOFF_ACTIVE
      lastBotPromptType: null, // 'ASK_CATEGORY', 'ASK_ITEM', 'ASK_QUANTITY', 'OFFER_QUOTE', 'ASK_CONTACT'
      leadCreated: false,
      handoffRequested: false,
      lastActive: Date.now()
    });
  }

  const session = sessions.get(id);
  session.lastActive = Date.now();
  return session;
}

// --- 2. Approved Verified Facts (Zero Hallucination Grounding) ---
const VERIFIED_KNOWLEDGE = {
  companyName: "UNIWEAR",
  foundingStatement: "Founded in 1998.",
  foundingYear: "1998",
  managingPartner: "Suresh H. A.",
  clientsServed: "3,000+ Clients Served",
  address: "No 121/A, 1st Floor, 27th Cross Road, 7th Block, Jayanagar, Bengaluru – 560070, Karnataka, India",
  phones: ["+91 80 2658 0000", "+91 91087 65831", "+91 98459 32201"],
  emails: {
    sales: "sales@uniwear.co",
    support: "connect@uniwear.co"
  },
  udyamRegistration: "UDYAM-KR-03-0105092",
  coreCategories: [
    "Industrial & Factory Workwear",
    "Corporate & Executive Apparel",
    "Hospitality & Culinary Uniforms",
    "Healthcare & Medical Scrubs",
    "Institutional & Educational Uniforms",
    "Corporate Gifting & Premium Merchandise"
  ],
  deliveryCoverage: "Manufacturing headquarters in Jayanagar, Bengaluru with delivery across India.",
  uncertaintyResponse: "I don't have verified information on that yet. I can help connect you with the UNIWEAR team for confirmation."
};

// --- 3. Levenshtein Distance & Fuzzy Matcher (Typo Tolerance) ---
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Canonical dictionary for fuzzy matching
const CANONICAL_TERMS = {
  // Categories & Synonyms
  "uniform": ["uniform", "unifrom", "unform", "uniforms", "unifrms"],
  "corporate": ["corporate", "corporet", "corparate", "corprate", "coporate", "office", "business", "executive"],
  "industrial": ["industrial", "industrl", "factory", "factry", "workwear", "workwer", "plant", "boiler", "coverall"],
  "hospitality": ["hospitality", "hospitlity", "hotel", "hotle", "restaurant", "resort", "chef", "kitchen", "apron"],
  "healthcare": ["healthcare", "hospital", "hospitl", "medical", "clinic", "scrub", "scrubs", "doctor", "nurse"],
  "institutional": ["institutional", "school", "college", "institute", "academy", "student"],
  "gifting": ["gifting", "gifts", "gift", "merchandise", "merch", "swag", "hamper"],
  // Items
  "shirt": ["shirt", "shirts", "shrt", "shrts"],
  "trouser": ["trouser", "trousers", "pant", "pants", "truser"],
  "blazer": ["blazer", "blazers", "suit", "suits"],
  "jacket": ["jacket", "jackets", "jacet"],
  "polo": ["polo", "polos", "tshirt", "t-shirt", "tee"],
  "scrub": ["scrub", "scrubs", "scurb"],
  "apron": ["apron", "aprons"],
  "coverall": ["coverall", "coveralls", "boilersuit", "boiler"],
  // Intent keywords
  "quotation": ["quotation", "quotaton", "quote", "qoute", "pricing", "price", "prce", "cost", "costing", "estimate", "rates", "rate", "budget"],
  "employee": ["employee", "employess", "employees", "people", "staff", "person", "workers", "worker"],
  "sales": ["sales", "human", "person", "representative", "agent", "call", "callback", "talk", "speak"],
  "moq": ["moq", "minimum", "min"]
};

function normalizeAndFuzzyMapToken(token) {
  const clean = token.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!clean || clean.length < 3) return clean;

  // Direct lookup
  for (const [canonical, variations] of Object.entries(CANONICAL_TERMS)) {
    if (variations.includes(clean)) return canonical;
  }

  // Fuzzy match if length >= 4
  if (clean.length >= 4) {
    for (const [canonical, variations] of Object.entries(CANONICAL_TERMS)) {
      for (const variant of variations) {
        if (Math.abs(clean.length - variant.length) <= 2) {
          const dist = levenshteinDistance(clean, variant);
          if (dist === 1 || (clean.length >= 6 && dist <= 2)) {
            return canonical;
          }
        }
      }
    }
  }

  return clean;
}

// Text Normalizer: breaks string into words and normalized tokens
function analyzeText(rawText) {
  const lower = String(rawText || '').toLowerCase().trim();
  const rawTokens = lower.split(/[\s,.;:!?()]+/).filter(Boolean);
  const normalizedTokens = rawTokens.map(normalizeAndFuzzyMapToken);
  const normalizedString = normalizedTokens.join(' ');
  return { lower, rawTokens, normalizedTokens, normalizedString };
}

// --- 4. Entity & Slot Extraction Engine ---
function extractEntities(rawText, analysis, existingSlots = {}) {
  const slots = { ...existingSlots };
  const { lower, normalizedTokens } = analysis;

  // 1. Category extraction
  if (normalizedTokens.includes('corporate') || /corporate|office|executive|formal\s+shirts?|suits?|blazers?/i.test(lower)) {
    slots.category = 'Corporate';
  } else if (normalizedTokens.includes('industrial') || /industrial|factory|plant|workwear|boilersuit|coverall|safety/i.test(lower)) {
    slots.category = 'Industrial';
  } else if (normalizedTokens.includes('hospitality') || /hospitality|hotel|restaurant|resort|chef|kitchen|apron/i.test(lower)) {
    slots.category = 'Hospitality';
  } else if (normalizedTokens.includes('healthcare') || /healthcare|hospital|medical|clinic|scrub|doctor|nurse/i.test(lower)) {
    slots.category = 'Healthcare';
  } else if (normalizedTokens.includes('institutional') || /institutional|school|college|institute|student/i.test(lower)) {
    slots.category = 'Institutional';
  } else if (normalizedTokens.includes('gifting') || /gifting|corporate\s+gifts?|merchandise|swag|hampers?/i.test(lower)) {
    slots.category = 'Corporate Gifting';
  }

  // 2. Specific Item / Product extraction
  if (normalizedTokens.includes('shirt') || /\bshirts?\b/i.test(lower)) {
    slots.item = 'shirts';
  } else if (normalizedTokens.includes('trouser') || /\b(?:trousers?|pants?)\b/i.test(lower)) {
    slots.item = 'trousers';
  } else if (normalizedTokens.includes('blazer') || /\b(?:blazers?|suits?)\b/i.test(lower)) {
    slots.item = 'blazers';
  } else if (normalizedTokens.includes('jacket') || /\bjackets?\b/i.test(lower)) {
    slots.item = 'jackets';
  } else if (normalizedTokens.includes('polo') || /\b(?:polos?|t-?shirts?)\b/i.test(lower)) {
    slots.item = 'polo T-shirts';
  } else if (normalizedTokens.includes('scrub') || /\bscrubs?\b/i.test(lower)) {
    slots.item = 'medical scrubs';
  } else if (normalizedTokens.includes('apron') || /\baprons?\b/i.test(lower)) {
    slots.item = 'aprons';
  } else if (normalizedTokens.includes('coverall') || /\b(?:coveralls?|boiler\s*suits?)\b/i.test(lower)) {
    slots.item = 'boiler suits';
  }

  // 3. Quantity extraction (handles "250", "for 500 people", "about 300", "around 1000", "quantity 200")
  const qtyPatterns = [
    /\b(?:for|around|about|approx|quantity|order\s+of)?\s*(\d{2,6})\s*(?:employees?|employess|people|persons?|sets?|pieces?|pcs?|shirts?|staff|members?|units?|uniforms?)?\b/i,
    /^\s*(\d{2,6})\s*$/
  ];

  for (const pat of qtyPatterns) {
    const match = rawText.match(pat);
    if (match && !rawText.includes('@') && !/^\d{10}$/.test(match[1])) {
      const parsed = parseInt(match[1], 10);
      if (parsed >= 10 && parsed <= 500000) {
        slots.quantity = parsed;
        break;
      }
    }
  }

  // 4. Contact details (email, phone, name, company)
  const emailMatch = rawText.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
  if (emailMatch) {
    slots.email = emailMatch[0].toLowerCase();
  }

  const phoneMatch = rawText.match(/(?:\+?91[\s-]?)?[6789]\d{9}\b/);
  if (phoneMatch) {
    slots.phone = phoneMatch[0].replace(/\s+/g, '');
  }

  const nameMatch = rawText.match(/(?:my name is|i am|this is|call me)\s+([A-Za-z\s]{2,25})/i);
  if (nameMatch && !/sales|someone|quote|help/i.test(nameMatch[1])) {
    slots.name = nameMatch[1].trim();
  }

  const companyMatch = rawText.match(/(?:from|at|company(?:\s+is)?)\s+([A-Za-z0-9\s&.-]{2,30})/i);
  if (companyMatch && !/bangalore|bengaluru|india|delhi|mumbai/i.test(companyMatch[1])) {
    slots.company = companyMatch[1].trim();
  }

  // 5. Timeline extraction
  const timelineMatch = rawText.match(/(?:before|within|by|timeline\s+is)\s+([A-Za-z0-9\s]{3,20})/i);
  if (timelineMatch) {
    slots.timeline = timelineMatch[0].trim();
  }

  return slots;
}

// --- 5. Intent Classifier with Multi-Signal Scoring ---
function classifyIntent(rawText, analysis, session) {
  const { lower, normalizedTokens } = analysis;
  const scores = {};

  const addScore = (intent, weight) => {
    scores[intent] = (scores[intent] || 0) + weight;
  };

  // Security / Adversarial Prompt Injection Defense
  if (/ignore (?:previous|all)|reveal (?:system|prompt)|print (?:env|secret|key|database)|system prompt/i.test(lower)) {
    return 'SECURITY_DEFENSE';
  }

  // Human Handoff
  if (/talk to (?:sales|someone|human|person|agent)|speak to|call me|contact (?:person|representative)|human (?:handoff|support)/i.test(lower) ||
      (normalizedTokens.includes('sales') && (normalizedTokens.includes('human') || lower.includes('speak') || lower.includes('talk')))) {
    addScore('HUMAN_HANDOFF', 10);
  }

  // Unverified Facts Trap (certifications, exact factory specs, machinery counts)
  if (/certification|certified|gots|anti-static|fr cert|fire retardant|medical cert|iso\b/i.test(lower)) {
    addScore('UNVERIFIED_TRAP', 10);
  }
  if (/factory size|sq ft|square feet|how many machines|machine count|exact capacity|monthly capacity|production capacity|audit/i.test(lower)) {
    addScore('UNVERIFIED_TRAP', 10);
  }

  // MOQ inquiry
  if (normalizedTokens.includes('moq') || /minimum order|min order|moq/i.test(lower)) {
    addScore('MOQ_INQUIRY', 8);
  }

  // Pricing inquiry
  if (/how much|cost|price|pricing|rate|budget/i.test(lower) || normalizedTokens.includes('quotation')) {
    addScore('PRICING_INQUIRY', 7);
  }

  // Direct Quotation Intent
  if (/quotation|quote|prepare quote|send quote|need quote|get quotation/i.test(lower)) {
    addScore('QUOTE_REQUEST', 7);
  }

  // Company Information & Background
  if (/about (?:uniwear|company|you)|who are you|where are you located|address|location|founding|when were you founded/i.test(lower)) {
    addScore('COMPANY_INFO', 8);
  }

  // Client Case Studies
  if (/wipro|toyota|clients|clientele|case study|case studies/i.test(lower)) {
    addScore('CLIENT_STORIES', 8);
  }

  // Delivery / Logistics Coverage
  if (/outside bangalore|pan india|delivery to|deliver to|shipping to|outside karnataka|mumbai|delhi|hyderabad|chennai/i.test(lower)) {
    addScore('DELIVERY_INQUIRY', 8);
  }

  // Greeting
  if (/^(hi|hello|hey|good (?:morning|afternoon|evening)|namaste|greetings)\b/i.test(lower) && lower.length < 25) {
    addScore('GREETING', 9);
  }

  // Product Discovery ("show me what you have", "show industrial products", "what products", "show me")
  if (/show (?:me )?(?:what you have|products|uniforms|catalog)|what uniforms|what (?:do you have|products)/i.test(lower) ||
      (lower.includes('show') && (normalizedTokens.includes('corporate') || normalizedTokens.includes('industrial') || normalizedTokens.includes('hospitality')))) {
    addScore('PRODUCT_DISCOVERY', 7);
  }

  // Category Discovery ("I need corporate uniforms", "hospitality uniforms")
  if (session.slots.category || normalizedTokens.includes('corporate') || normalizedTokens.includes('industrial') || normalizedTokens.includes('hospitality') || normalizedTokens.includes('healthcare')) {
    addScore('CATEGORY_INQUIRY', 5);
  }

  // Follow-up: Just Quantity Provided (e.g. "250", "about 500")
  if (session.slots.quantity && (/^\s*(?:for|about|around)?\s*\d{2,6}\s*(?:people|employees|sets|pieces)?\s*$/i.test(lower) || session.lastBotPromptType === 'ASK_QUANTITY')) {
    addScore('QUANTITY_SPECIFICATION', 8);
  }

  // Follow-up: Just Item Provided (e.g. "shirts", "jackets")
  if (session.slots.item && session.lastBotPromptType === 'ASK_ITEM') {
    addScore('ITEM_SPECIFICATION', 8);
  }

  // Affirmative continuation ("yes", "sure", "please do", "ok")
  if (/^(yes|yeah|sure|yep|definitely|proceed|ok|okay|please)\b/i.test(lower) && lower.length < 20) {
    addScore('AFFIRMATIVE', 8);
  }

  // Pick highest scoring intent
  let highestIntent = 'GENERAL_CONVERSATION';
  let maxScore = 0;
  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      highestIntent = intent;
    }
  }

  return highestIntent;
}

// --- 6. Controlled MongoDB Product Search Tool ---
async function searchProducts(keyword = '', category = '') {
  try {
    const filter = { status: 'Active' };
    const andClauses = [];

    if (category) {
      andClauses.push({
        $or: [
          { category: { $regex: category, $options: 'i' } },
          { displayLocations: { $regex: category, $options: 'i' } }
        ]
      });
    }

    if (keyword) {
      andClauses.push({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { desc: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { fabric: { $regex: keyword, $options: 'i' } }
        ]
      });
    }

    if (andClauses.length > 0) {
      filter.$and = andClauses;
    }

    const products = await Product.find(filter)
      .select('name category desc description img image price fabric')
      .limit(3)
      .lean();

    return products.map(p => ({
      title: p.name,
      category: p.category || 'Uniform',
      desc: p.desc || p.description || '',
      image: p.img || p.image || '/images/logo.png',
      link: p.category && p.category.toLowerCase().includes('gift') ? 'gifts.html' : 'uniforms.html#' + (p.category ? p.category.toLowerCase() : '')
    }));
  } catch (err) {
    console.error('[Chatbot Product Search Error]', err.message);
    return [];
  }
}

// --- 7. Genuine Lead Creation in MongoDB (Zero Duplicates) ---
async function createChatbotLead(session, messageText) {
  if (session.leadCreated) return null;

  const { slots } = session;
  const hasContact = (slots.email && slots.email.includes('@')) || (slots.phone && slots.phone.replace(/[^0-9]/g, '').length >= 10);
  if (!hasContact) return null;

  try {
    const lead = await Lead.create({
      name: slots.name || (slots.email ? slots.email.split('@')[0] : 'Website Visitor'),
      company: slots.company || 'Corporate Client',
      email: slots.email || 'connect@uniwear.co',
      phone: slots.phone || '',
      category: slots.category || 'General Inbound',
      volume: slots.quantity ? parseInt(String(slots.quantity).replace(/[^0-9]/g, ''), 10) || 0 : 0,
      source: 'Chatbot',
      stage: 'New Lead',
      details: `Chatbot Inbound Lead. Category: ${slots.category || 'Not specified'}. Item: ${slots.item || 'Not specified'}. Volume: ${slots.quantity || 'TBD'}. Timeline: ${slots.timeline || 'Standard'}. Requirement: "${messageText.substring(0, 150)}"`
    });

    session.leadCreated = true;

    // Trigger Admin Notification in MongoDB
    await Notification.create({
      recipient: 'admin',
      title: 'New Chatbot Lead',
      text: `Chatbot captured lead from ${lead.name} (${lead.company || lead.email}). Need: ${lead.category}, Qty: ${lead.volume || 'TBD'}.`,
      time: 'Just now'
    });

    // Optional mailer trigger
    try {
      const settings = await CompanySettings.findOne().lean() || {};
      if (emailTemplates && typeof emailTemplates.chatbotHandoff === 'function') {
        sendMail(emailTemplates.chatbotHandoff(lead, settings)).catch(() => {});
      }
    } catch (_) {}

    return lead;
  } catch (err) {
    console.error('[Chatbot Lead Creation Error]', err.message);
    return null;
  }
}

// --- 8. Controlled Natural Response Planning & Generation ---
async function planAndGenerateResponse(intent, rawText, analysis, session) {
  const { slots } = session;
  const lower = analysis.lower;

  let reply = "";
  let chips = [];
  let products = [];
  let handoff = false;

  // 1. Security Defense
  if (intent === 'SECURITY_DEFENSE') {
    reply = "I am the UNIWEAR Assistant. I can help you explore our uniform collections, understand custom manufacturing capabilities, and arrange a personalized quotation with our Bengaluru team. How can I assist you with your uniform requirements today?";
    chips = [
      { text: "👔 Corporate Uniforms", value: "Show me corporate uniforms" },
      { text: "🏭 Industrial Workwear", value: "Show me industrial uniforms" },
      { text: "💰 Request a Quotation", value: "I need a quotation" }
    ];
    session.lastBotPromptType = 'DISCOVERY';
    return { reply, chips, products, handoff };
  }

  // 2. Unverified Claims Trap (Certifications, Factory Size, Capacity)
  if (intent === 'UNVERIFIED_TRAP') {
    reply = VERIFIED_KNOWLEDGE.uncertaintyResponse;
    chips = [
      { text: "📞 Contact UNIWEAR Team", value: "I want to talk to sales" },
      { text: "💰 Request a Quotation", value: "I need a quotation" }
    ];
    session.lastBotPromptType = 'OFFER_QUOTE';
    return { reply, chips, products, handoff };
  }

  // 3. Human Handoff
  if (intent === 'HUMAN_HANDOFF') {
    handoff = true;
    session.handoffRequested = true;

    if (!slots.email && !slots.phone) {
      reply = `I would be happy to connect you directly with a UNIWEAR representative. Could you share your **phone number or email address**, and your company name? Our team will follow up directly.`;
      chips = [
        { text: "📞 Call +91 91087 65831", value: "tel:+919108765831" },
        { text: "📝 Open Contact Form", value: "Go to contact page" }
      ];
      session.lastBotPromptType = 'ASK_CONTACT';
    } else {
      reply = `Thank you! I have queued your request with our sales team with your contact details (${slots.phone || slots.email}). A dedicated UNIWEAR specialist will follow up with you. You can also reach our Bengaluru desk directly at **+91 91087 65831** or **sales@uniwear.co**.`;
      chips = [
        { text: "🌐 Visit Contact Page", value: "Go to contact page" },
        { text: "📁 Browse Product Catalog", value: "Show me uniforms" }
      ];
      session.lastBotPromptType = 'HANDOFF_COMPLETED';
    }

    await createChatbotLead(session, rawText);
    return { reply, chips, products, handoff };
  }

  // 4. Greetings
  if (intent === 'GREETING') {
    reply = "Hello! Welcome to UNIWEAR. We design and manufacture custom enterprise uniforms, industrial workwear, and corporate gifting in Bengaluru.\n\nWhat type of uniforms are you looking for — corporate, industrial, hospitality, institutional, or custom?";
    chips = [
      { text: "👔 Corporate Uniforms", value: "Corporate uniforms" },
      { text: "🏭 Industrial Workwear", value: "Industrial workwear" },
      { text: "🏨 Hospitality Uniforms", value: "Hospitality uniforms" },
      { text: "🏥 Healthcare Scrubs", value: "Healthcare scrubs" },
      { text: "💰 Request Quotation", value: "I need a quotation" }
    ];
    session.lastBotPromptType = 'ASK_CATEGORY';
    return { reply, chips, products, handoff };
  }

  // 5. Company Info & Background
  if (intent === 'COMPANY_INFO') {
    reply = `**UNIWEAR** was founded in 1998 under Managing Partner **${VERIFIED_KNOWLEDGE.managingPartner}** and has served 3,000+ clients across India.\n\n• **Location**: ${VERIFIED_KNOWLEDGE.address}\n• **Udyam Registration**: ${VERIFIED_KNOWLEDGE.udyamRegistration}\n• **Approved Product Lines**: Corporate, Industrial, Hospitality, Healthcare, Institutional, and Corporate Gifting.\n\nWould you like to explore our product lines or connect with our team for a quotation?`;
    chips = [
      { text: "👕 Explore Uniforms", value: "Show me uniforms" },
      { text: "📍 Visit about.html", value: "Go to about page" },
      { text: "💰 Request a Quote", value: "I need a quotation" }
    ];
    session.lastBotPromptType = 'DISCOVERY';
    return { reply, chips, products, handoff };
  }

  // 6. Client Stories (Toyota, Wipro)
  if (intent === 'CLIENT_STORIES') {
    reply = "UNIWEAR has served 3,000+ clients across India, with verified programs including Wipro Technologies and Toyota Kirloskar Motor.\n\nWould you like to connect with our team to discuss your organization's uniform requirements?";
    chips = [
      { text: "💰 Request a Quotation", value: "I need a quotation" },
      { text: "📞 Talk to Sales Team", value: "I want to talk to sales" },
      { text: "👕 Explore Uniforms", value: "Show me uniforms" }
    ];
    session.lastBotPromptType = 'OFFER_QUOTE';
    return { reply, chips, products, handoff };
  }

  // 7. Delivery Outside Bangalore / Geographic Coverage
  if (intent === 'DELIVERY_INQUIRY') {
    reply = `Yes, absolutely! While our manufacturing headquarters is located in **Jayanagar, Bengaluru**, UNIWEAR delivers uniform programs across India.\n\nWhere would you like your uniforms delivered?`;
    chips = [
      { text: "💰 Request Delivery Quote", value: "I need a quotation with delivery" },
      { text: "📞 Contact Logistics Team", value: "I want to talk to sales" }
    ];
    session.lastBotPromptType = 'OFFER_QUOTE';
    return { reply, chips, products, handoff };
  }

  // 8. MOQ Inquiries
  if (intent === 'MOQ_INQUIRY') {
    reply = VERIFIED_KNOWLEDGE.uncertaintyResponse;
    chips = [
      { text: "📞 Contact UNIWEAR Team", value: "I want to talk to sales" },
      { text: "💰 Request a Quotation", value: "I need a quotation" }
    ];
    session.lastBotPromptType = 'OFFER_QUOTE';
    return { reply, chips, products, handoff };
  }

  // 9. Pricing Inquiries (Refuses to hallucinate fixed prices, connects to context)
  if (intent === 'PRICING_INQUIRY') {
    const itemCtx = slots.item ? `${slots.quantity ? slots.quantity + ' ' : ''}${slots.category || ''} ${slots.item}`.trim() : (slots.category ? `${slots.category} uniforms` : 'uniforms');
    reply = `Exact pricing for ${itemCtx} depends on fabric selection, construction complexity, logo branding, and order volume. I don't have verified pricing for that yet. I can help connect you with the UNIWEAR team for confirmation and a formal quotation.\n\nWould you like our team to prepare a quotation?`;
    chips = [
      { text: "💰 Yes, Prepare Quote", value: "Yes, prepare a quotation" },
      { text: "📞 Speak to Sales", value: "I want to talk to sales" },
      { text: "📁 Browse Products", value: `Show me ${slots.category || 'corporate'} products` }
    ];
    session.lastBotPromptType = 'OFFER_QUOTE';
    return { reply, chips, products, handoff };
  }

  // 10. Affirmative answer to quote offer
  if (intent === 'AFFIRMATIVE' && (session.lastBotPromptType === 'OFFER_QUOTE' || session.lastBotPromptType === 'ASK_QUANTITY')) {
    if (!slots.quantity) {
      reply = "Great! Roughly how many employees or uniform sets are you planning for?";
      chips = [
        { text: "100 Sets", value: "100 sets" },
        { text: "250 Sets", value: "250 sets" },
        { text: "500 Sets", value: "500 sets" }
      ];
      session.lastBotPromptType = 'ASK_QUANTITY';
      return { reply, chips, products, handoff };
    }
    if (!slots.email && !slots.phone) {
      reply = `Understood — ${slots.quantity} ${slots.category || 'uniform'} ${slots.item || 'sets'}. What is your name and the best email or phone number for the quotation?`;
      chips = [
        { text: "📞 Call Sales Directly", value: "I want to talk to sales" }
      ];
      session.lastBotPromptType = 'ASK_CONTACT';
      return { reply, chips, products, handoff };
    }
  }

  // 11. Lead Capture completion (User provided email/phone)
  if (slots.email || slots.phone) {
    const lead = await createChatbotLead(session, rawText);
    if (lead) {
      reply = `Thank you! I have registered your requirement for **${slots.category || 'Uniform Program'}** (${slots.quantity ? slots.quantity + ' units' : 'Bulk'}) under **${slots.company || slots.name || 'your organization'}**.\n\nA senior uniform consultant from our Bengaluru headquarters will review your specifications and contact you at **${slots.phone || slots.email}** with quotation options.\n\nIs there anything specific you would like included, such as custom logo embroidery?`;
      chips = [
        { text: "🧵 Custom Logo Embroidery", value: "We need custom logo embroidery" },
        { text: "📁 Browse Catalog", value: "Show me uniforms" }
      ];
      session.lastBotPromptType = 'LEAD_CONFIRMED';
      return { reply, chips, products, handoff: false };
    }
  }

  // 12. Product Discovery ("Show industrial products", "Show me what you have")
  if (intent === 'PRODUCT_DISCOVERY' || /show|browse|catalog/i.test(lower)) {
    const catToSearch = slots.category || (
      lower.includes('industrial') ? 'Industrial' :
      lower.includes('corporate') ? 'Corporate' :
      lower.includes('hospitality') ? 'Hospitality' :
      lower.includes('health') ? 'Healthcare' : 'Corporate'
    );
    products = await searchProducts('', catToSearch);

    if (products.length > 0) {
      reply = `Here are some of our **${catToSearch}** products from our catalog:\n\nHow many employees or sets are you looking to outfit?`;
    } else {
      reply = `I couldn't find a matching product in the current catalog for that exact specification. I can still help you with a custom requirement or connect you with the UNIWEAR team.`;
    }

    chips = [
      { text: "100 - 250 Sets", value: `I need ${catToSearch} uniforms for 200 people` },
      { text: "500+ Bulk Order", value: `I need ${catToSearch} uniforms for 500 people` },
      { text: "💰 Request Quotation", value: `I need a quotation for ${catToSearch} uniforms` }
    ];
    session.lastBotPromptType = 'ASK_QUANTITY';
    return { reply, chips, products, handoff };
  }

  // 13. Conversational Progression & Qualification State Machine
  // Scenario A: User gave category but no item or quantity (e.g. "Corporate")
  if (slots.category && !slots.item && !slots.quantity) {
    if (slots.category === 'Corporate') {
      reply = "Got it. What kind of corporate uniforms do you need — shirts, trousers, polo T-shirts, blazers, or a complete employee uniform set?";
      chips = [
        { text: "👔 Corporate Shirts", value: "Corporate shirts" },
        { text: "👖 Formal Trousers", value: "Formal trousers" },
        { text: "🧥 Blazers & Suits", value: "Corporate blazers" },
        { text: "👕 Polo T-Shirts", value: "Corporate polo T-shirts" }
      ];
      session.lastBotPromptType = 'ASK_ITEM';
      return { reply, chips, products, handoff };
    }
    if (slots.category === 'Industrial') {
      reply = "Understood. What type of industrial workwear are you looking for — boiler suits, coveralls, industrial shirts & trousers, or reflective workwear?";
      chips = [
        { text: "🏭 Boiler Suits", value: "Industrial boiler suits" },
        { text: "👷 Worker Shirts & Pants", value: "Industrial worker shirts" },
        { text: "🦺 Reflective Workwear", value: "Reflective workwear" }
      ];
      session.lastBotPromptType = 'ASK_ITEM';
      return { reply, chips, products, handoff };
    }
    if (slots.category === 'Hospitality') {
      reply = "Sure. What hospitality uniforms are you planning for — chef coats, kitchen aprons, service staff uniforms, or front-desk attire?";
      chips = [
        { text: "👨‍🍳 Chef Coats", value: "Chef coats" },
        { text: "🍳 Kitchen Aprons", value: "Kitchen aprons" },
        { text: "🏨 Service Staff Uniforms", value: "Service staff uniforms" }
      ];
      session.lastBotPromptType = 'ASK_ITEM';
      return { reply, chips, products, handoff };
    }
    reply = `Got it — ${slots.category} uniforms. What specific items or styles are you planning for your team?`;
    chips = [
      { text: "💰 Request a Quotation", value: "I need a quotation" },
      { text: "📁 Browse Products", value: `Show me ${slots.category} products` }
    ];
    session.lastBotPromptType = 'ASK_ITEM';
    return { reply, chips, products, handoff };
  }

  // Scenario B: Category and Item known, but no Quantity (e.g. "Corporate shirts")
  if (slots.category && slots.item && !slots.quantity) {
    reply = `Understood — ${slots.category} ${slots.item}. Roughly how many employees or sets do you need?`;
    chips = [
      { text: "100 Sets", value: `100 ${slots.item}` },
      { text: "250 Sets", value: `250 ${slots.item}` },
      { text: "500 Sets", value: `500 ${slots.item}` },
      { text: "1,000+ Enterprise", value: `1000 ${slots.item}` }
    ];
    session.lastBotPromptType = 'ASK_QUANTITY';
    return { reply, chips, products, handoff };
  }

  // Scenario C: Quantity specified (e.g. "Shirts for 250 people")
  if (slots.quantity && !slots.email && !slots.phone) {
    const itemDesc = slots.item ? `${slots.category || ''} ${slots.item}`.trim() : (slots.category ? `${slots.category} uniforms` : 'uniforms');
    reply = `That sounds like a good fit for a bulk program (${slots.quantity} ${itemDesc}). What approximate fabric preference or delivery timeline do you have? I can also help you request a formal quotation from the UNIWEAR team.`;
    chips = [
      { text: "💰 Request Quotation", value: "Yes, prepare a quotation" },
      { text: "📞 Speak to Sales", value: "I want to talk to sales" },
      { text: "🧵 Custom Logo Branding", value: "We need custom logo embroidery" }
    ];
    session.lastBotPromptType = 'OFFER_QUOTE';
    return { reply, chips, products, handoff };
  }

  // Scenario D: Quote Request Intent without enough details
  if (intent === 'QUOTE_REQUEST') {
    reply = "I would be happy to help coordinate your quotation. To recommend the best options, could you let me know what type of uniforms you need and for roughly how many employees?";
    chips = [
      { text: "👔 Corporate Uniforms", value: "Corporate uniforms for 150 people" },
      { text: "🏭 Industrial Workwear", value: "Industrial workwear for 200 people" },
      { text: "🏨 Hospitality Uniforms", value: "Hospitality uniforms for 80 people" }
    ];
    session.lastBotPromptType = 'ASK_CATEGORY';
    return { reply, chips, products, handoff };
  }

  // Default Natural Conversational Fallback
  reply = "I can help you explore uniform styles, check bulk order specifications, learn about our Bengaluru facility, or connect with our sales team for a custom quote.\n\nWhat kind of uniforms or workwear is your company looking for?";
  chips = [
    { text: "👔 Corporate Uniforms", value: "I need corporate uniforms" },
    { text: "🏭 Industrial Workwear", value: "I need industrial uniforms" },
    { text: "💰 Request a Quotation", value: "I need a quotation" },
    { text: "📞 Contact Sales Team", value: "I want to speak with sales" }
  ];
  session.lastBotPromptType = 'DISCOVERY';
  return { reply, chips, products, handoff };
}

// --- 9. Primary Service Entry Point ---
async function processMessage(userMessage, conversationId, userContext = {}) {
  const session = getOrCreateSession(conversationId);
  const cleanInput = String(userMessage || '').trim().substring(0, 500);

  // 1. Text normalization & typo-tolerant tokenization
  const analysis = analyzeText(cleanInput);

  // 2. Entity & slot extraction
  session.slots = extractEntities(cleanInput, analysis, session.slots);

  // 3. Multi-signal intent classification
  const intent = classifyIntent(cleanInput, analysis, session);

  // 4. Record turn in bounded history (last 10 turns)
  session.history.push({ role: 'user', content: cleanInput });
  if (session.history.length > 10) {
    session.history.splice(0, session.history.length - 10);
  }

  // 5. Plan and generate local conversational response
  const responsePlan = await planAndGenerateResponse(intent, cleanInput, analysis, session);

  // 6. Append assistant message to history
  session.history.push({ role: 'assistant', content: responsePlan.reply });

  return {
    success: true,
    reply: responsePlan.reply,
    conversationId: session.id,
    chips: responsePlan.chips || [],
    products: responsePlan.products || [],
    leadCaptured: session.leadCreated,
    handoff: responsePlan.handoff,
    provider: 'local-engine'
  };
}

module.exports = {
  processMessage,
  searchProducts,
  getOrCreateSession,
  VERIFIED_KNOWLEDGE
};
