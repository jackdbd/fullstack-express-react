const appRoot = require("app-root-path");
const winston = require("winston");

// define the custom settings for each transport (file, console)
const options = {
  file: {
    name: "fileLogger",
    level: "info",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    prettyPrint: false,
    timestamp: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    name: "consoleLogger",
    level: "debug",
    handleExceptions: true,
    prettyPrint: true,
    timestamp: false,
    json: false,
    colorize: true
  }
};

const logger = new winston.Logger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false // do not exit on handled exceptions
});

/*
  By default, morgan outputs to the console only, so let's define a stream
  function that will be able to get morgan-generated output into the winston
  log files.
*/
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
