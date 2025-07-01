import app from './src/app.js';
import { PORT } from './src/config/environment.js';
import logger from './src/utils/logger.js';

const startServer = () => {
  try {
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
      logger.info(`📋 Health check: http://localhost:${PORT}/api/health`);
      logger.info(`💬 Chat endpoint: http://localhost:${PORT}/api/chat`);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  logger.info('Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Cerrando servidor...');
  process.exit(0);
});

// Solo iniciar servidor si no estamos en producción o si se ejecuta directamente
if (process.env.NODE_ENV !== 'production' || process.env.npm_lifecycle_event !== 'start') {
  startServer();
}

export default app;