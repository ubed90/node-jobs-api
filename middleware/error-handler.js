// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
  console.log(err);

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong. Please try again later!"
  }

  // ! Since we are using CUstom Object
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  // * Validation Error
  if(err.name === "ValidationError") {
    customError.msg = Object.values(err.errors).map(item => item.message).join(", ");
    customError.statusCode = 400;
  }

  // * Duplicate Error
  if(err.code && err.code === 11000) {
    customError.msg = `Email already in use.`;
    customError.statusCode = 400;
  }

  // * Cast Error
  if(err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware
