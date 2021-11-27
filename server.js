const express = require("./config/express");
const { logger } = require("./config/winston");
const port = 3000;


var server = express().listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);
server.timeout = 5000;