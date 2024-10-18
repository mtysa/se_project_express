const { DefaultError, defaultErrorMessage } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err);
  return res.status(DefaultError).send({ message: defaultErrorMessage });
};

module.exports = { errorHandler };
