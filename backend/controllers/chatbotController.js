const chatbotService = require('../services/chatbotService');

// POST /api/chatbot/message
const sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId, userContext } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty.'
      });
    }

    if (message.length > 600) {
      return res.status(400).json({
        success: false,
        message: 'Message exceeds the 600-character limit.'
      });
    }

    const result = await chatbotService.processMessage(
      message.trim(),
      conversationId,
      userContext || {}
    );

    res.json({
      success: true,
      data: result,
      ...result
    });
  } catch (err) {
    console.error('[Chatbot Controller Error]:', err);
    res.status(500).json({
      success: false,
      reply: "I am having temporary trouble accessing my records. You can reach our Bengaluru team directly at +91 91087 65831 or sales@uniwear.co.",
      chips: [
        { text: "📞 Contact Sales", value: "I want to talk to sales" },
        { text: "🌐 Visit Contact Page", value: "Go to contact page" }
      ]
    });
  }
};

// GET /api/chatbot/info
const getChatbotInfo = async (req, res) => {
  res.json({
    success: true,
    data: {
      botName: "UNIWEAR Assistant",
      status: "online",
      engine: "local-conversational-engine",
      externalAiRequired: false,
      company: chatbotService.VERIFIED_KNOWLEDGE.companyName,
      foundingStatement: chatbotService.VERIFIED_KNOWLEDGE.foundingStatement,
      udyamRegistration: chatbotService.VERIFIED_KNOWLEDGE.udyamRegistration,
      headquarters: "Jayanagar, Bengaluru"
    }
  });
};

module.exports = {
  sendMessage,
  getChatbotInfo
};
