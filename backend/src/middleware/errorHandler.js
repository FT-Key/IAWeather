import logger from '../utils/logger.js';
import { NODE_ENV } from '../config/environment.js';

export const errorHandler = (error, req, res, next) => {
  logger.error('Error capturado:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  const isDevelopment = NODE_ENV === 'development';

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Error interno del servidor',
    ...(isDevelopment && { stack: error.stack })
  });
};