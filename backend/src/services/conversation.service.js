class ConversationService {
  buildMessages(conversation, currentMessage) {
    const messages = [];

    // Agregar mensajes del historial si existen
    if (conversation && conversation.length > 0) {
      conversation.forEach(msg => {
        messages.push({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    // Agregar el mensaje actual
    messages.push({
      role: 'user',
      content: currentMessage
    });

    return messages;
  }
}

export const conversationService = new ConversationService();