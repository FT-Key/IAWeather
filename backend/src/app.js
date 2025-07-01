import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { corsConfig } from './config/environment.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(corsConfig);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging con logger real
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Servir archivos estáticos
app.use(express.static(join(__dirname, '../public')));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public', 'index.html'));
});
// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

export default app;
