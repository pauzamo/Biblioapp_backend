const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithAI = async (userMessage, conversationHistory = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const systemContext = `Eres un asistente experto en libros para un ecommerce llamado "BiblioApp". Tu trabajo es ayudar a los clientes a encontrar libros que les interesen. Sé amable, útil y conciso en tus respuestas. Si te preguntan sobre libros más vendidos, bestsellers o recomendaciones, proporciona información precisa y útil.

    - Aclaración: la fecha actual es Octubre 2025.
    
    INSTRUCCIONES IMPORTANTES:
    - NUNCA uses placeholders como [Aquí irían...], [Ejemplo 1], [Nombre del libro], etc.
    - Si te preguntan por bestsellers de algún año en particular, recomienda títulos REALES que fueron populares ese año
    - Si no estás seguro de un título específico, recomienda clásicos bestsellers conocidos
    - Responde de forma directa y natural, como si fueras un librero experto
    - Usa formato markdown simple: **negrita** para títulos, - para listas
    - Máximo 150 palabras por respuesta
    - Sé específico: menciona títulos y autores reales

    `;
    
    const fullPrompt = `${systemContext}\n\nUsuario: ${userMessage}\n\nAsistente:`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    return {
      success: true,
      message: text
    };
  } catch (error) {
    console.error('Error en aiService:', error);
    return {
      success: false,
      message: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.',
      error: error.message
    };
  }
};

module.exports = { chatWithAI };