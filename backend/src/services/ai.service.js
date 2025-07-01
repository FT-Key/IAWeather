import { HUGGINGFACE_TOKEN, AI_CONFIG } from '../config/environment.js';
import logger from '../utils/logger.js';

class AIService {
  async getChatCompletion(messages) {
    try {
      const response = await fetch(AI_CONFIG.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          messages: messages,
          max_tokens: AI_CONFIG.maxTokens,
          temperature: AI_CONFIG.temperature
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      return {
        content: data.choices[0].message.content,
        model: data.model
      };

    } catch (error) {
      logger.error('Error en AIService:', error);
      throw new Error(`Error de IA: ${error.message}`);
    }
  }
}

export const aiService = new AIService();