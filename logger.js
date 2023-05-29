import winston from 'winston';

export default winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(log => `${log.timestamp} \u00b7 ${log.level} \u00b7 ${log.message}`)
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/info.log',
      level: 'info',
    }),
    new winston.transports.Console({
      level: 'info',
    }),
  ],
});
