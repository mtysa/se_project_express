const jwt = require("jsonwebtoken");
const { unauthorizedError } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(unauthorizedError)
      .send({ message: "Authorization is required." });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(unauthorizedError)
      .send({ message: "Authorization is required." });
  }
  req.user = payload;
  return next();
};

module.exports = { auth };
