const unlinkImage = require('../helpers/unlinkImage');
const logger = require('../helpers/logger');
const response = require('../helpers/response')
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const ApiError = require('../helpers/ApiError');

function errorConverter(err, req, res, next){
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
}

function notFoundHandler(req, res, next){
  throw new ApiError(
    httpStatus.NOT_FOUND,
    `Requested api not found: ${req.method} ${req.originalUrl}`
  );
}

function errorHandler(err, req, res, next){
  logger.error(err,req.originalUrl);
  if(req.file){
    unlinkImage(req.file.path)
  }
  return res.status(err.statusCode).json(response({ status: 'Error', statusCode: err.statusCode, type: err.name, message: err.message, data: null }));
}

module.exports = {notFoundHandler, errorHandler, errorConverter}
