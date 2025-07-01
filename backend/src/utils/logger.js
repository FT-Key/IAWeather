import { NODE_ENV } from '../config/environment.js';

class Logger {
  info(message, meta = {}) {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
  }

  error(message, meta = {}) {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta);
  }

  warn(message, meta = {}) {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
  }

  debug(message, meta = {}) {
    if (NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
    }
  }
}

export default new Logger();