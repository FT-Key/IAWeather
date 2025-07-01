import { successResponse } from '../utils/response.js';

export const healthCheck = (req, res) => {
  successResponse(res, {
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  }, 'API funcionando correctamente!');
};