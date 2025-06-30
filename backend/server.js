import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Servidor Activo</title>
<style>
  body {
    background: #121212;
    color: #fff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    height: 100vh;
    margin: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .indicator {
    width: 80px;
    height: 80px;
    background: #4caf50;
    border-radius: 50%;
    box-shadow: 0 0 15px #4caf50aa;
    animation: pulse 2s infinite ease-in-out;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 15px #4caf50aa;
    }
    50% {
      transform: scale(1.2);
      box-shadow: 0 0 30px #4caf50cc;
    }
  }

  h1 {
    font-size: 2rem;
    letter-spacing: 1.5px;
  }

  .checkmark {
    color: #4caf50;
    font-weight: bold;
    margin-left: 8px;
  }
</style>
</head>
<body>
  <div class="indicator"></div>
  <h1>Servidor funcionando <span class="checkmark">✅</span></h1>
</body>
</html>`);
});

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

/* app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
}); */

export default app;