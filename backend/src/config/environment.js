import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN;

// Validar variables de entorno críticas
if (!HUGGINGFACE_TOKEN) {
  throw new Error('HUGGINGFACE_TOKEN es requerido');
}

export const corsConfig = cors({
  origin: NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

export const AI_CONFIG = {
  model: "deepseek/deepseek-v3-0324",
  maxTokens: 1000,
  temperature: 0.7,
  apiUrl: 'https://router.huggingface.co/novita/v3/openai/chat/completions'
};