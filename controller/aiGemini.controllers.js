const aiGeminiService = require('../service/aiGemini.service');

const chatWithAI = async (req,res) => {
    try {
    const { message, conversationHistory } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'El mensaje no puede estar vacío'
      });
    }
    
    const response = await aiGeminiService.chatWithAI(message, conversationHistory);
    res.json(response);
  } catch (error) {
    console.error('Error en /api/chat:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = { chatWithAI };