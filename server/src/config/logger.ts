import { createLogger, format, transports } from 'winston';
import dotenv from 'dotenv'
import DailyRotateFile from 'winston-daily-rotate-file';

dotenv.config();

const logLevel = process.env.LOG_LEVEL || 'debug';

const logger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'novel-notes-service' },
  transports: [
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',  
    }),
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d', 
    }),
  ],
});

const nodeEnv = process.env.NODE_ENV

if (nodeEnv !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.printf(({ level, message, label, timestamp, stack }) => {
        return `${timestamp} [${label || 'default'}] ${level}: ${stack || message}`;
      })
    ),
  }));
}

logger.on('error', (err) => {
  if (nodeEnv !== 'production') {
    console.error('Logger encountered an error:', err);
  }
});

export default logger;
