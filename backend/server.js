import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.get('/api/health', (req, res) => {
  res.json({ message: 'API funcionando correctamente!' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversation } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Mensaje requerido' });
    }

    // Construir el historial de conversación para el contexto
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
      content: message
    });

    const response = await fetch('https://router.huggingface.co/novita/v3/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-v3-0324",
        messages: messages,
        max_tokens: 1000, // Aumentado para respuestas más largas
        temperature: 0.7
      })
    });

    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      return res.json({
        success: true,
        response: aiResponse,
        model: data.model,
        timestamp: new Date().toISOString()
      });
    } else {
      const errorText = await response.text();
      return res.status(response.status).json({
        success: false,
        error: `API Error: ${response.status} ${errorText}`
      });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor: ' + error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});