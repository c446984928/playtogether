const winston = require('winston');
const moment = require('moment');
const DailyRotateFile = require('winston-daily-rotate-file');

const ConsoleTransports = new (winston.transports.Console)({
    level: 'debug',
    colorize: true,
    timestamp: function () {
        return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
    },
    formatter: function (options) {
        // Return string will be passed to logger.
        return options.level.toUpperCase() + ' ' + options.timestamp() + ' ' + (options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
    }
});

const fileTransports = new DailyRotateFile({
    name: 'log',
    filename: 'info.log',
    dirname: __dirname + '/../log',
    level: 'info',
    colorize: true,
    maxsize: 1024 * 1024 * 10,
    datePattern: '.yyyy-MM-dd',
    timestamp: function () {
        return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
    },
    formatter: function (options) {
        // Return string will be passed to logger.
        return options.level.toUpperCase() + ' ' + options.timestamp() + ' ' + (options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
    },
    json: false,
    handleExceptions: true
});

const errTransports = new DailyRotateFile({
    name: 'errlog',
    filename: 'err.log',
    dirname: __dirname + '/../log',
    level: 'error',
    colorize: true,
    maxsize: 1024 * 1024 * 10,
    datePattern: '.yyyy-MM-dd',
    timestamp: function () {
        return moment().format('YYYY-MM-DD HH:mm:ss:SSS');
    },
    formatter: function (options) {
        // Return string will be passed to logger.
        return options.level.toUpperCase() + ' ' + options.timestamp() + ' ' + (options.message ? options.message : '') +
            (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
    },
    json: false,
    handleExceptions: true
});


let logger = new (winston.Logger)({
    exitOnError: false,
    transports: [
        ConsoleTransports,
        // fileTransports,
        // errTransports
    ]
});

module.exports = logger;
