const { serverError } = require('../utils/constants');

// eslint-disable-next-line no-unused-vars
const handleErrors = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? serverError
        : message,
    });
};

module.exports = handleErrors;
