const winston = require('winston')

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logRecordError.log',
      level: 'error',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new winston.transports.File({
      filename: 'logInfo.log',
      level: 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  )
}

module.exports = logger
