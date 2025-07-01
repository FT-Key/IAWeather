import { aiService } from '../services/ai.service.js';
import { conversationService } from '../services/conversation.service.js';
import { successResponse, errorResponse } from '../utils/response.js';
import logger from '../utils/logger.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { message, conversation } = req.body;
    console.log(req.body)

    if (!message?.trim()) {
      return errorResponse(res, 'Mensaje requerido', 400);
    }

    // Construir mensajes para la IA
    const messages = conversationService.buildMessages(conversation, message);
    console.log("Mensajes: ",messages)

    // Obtener respuesta de la IA
    const aiResponse = await aiService.getChatCompletion(messages);
    console.log("aiResponse: ", aiResponse)

    logger.info(`Chat completado para usuario: ${req.ip}`);

    return successResponse(res, {
      response: aiResponse.content,
      model: aiResponse.model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error en chat:', error);
    next(error);
  }
};