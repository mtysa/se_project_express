const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  invalidData,
  idNotFound,
  defaultError,
  defaultErrorMessage,
  unauthorizedError,
  conflictError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  const { userId } = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(invalidData)
          .send({ message: "An error has occurred with the requested ID." });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(idNotFound)
          .send({ message: "An error has occurred with the requested ID." });
      } else {
        res.status(defaultError).send({ message: defaultErrorMessage });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    return res
      .status(invalidData)
      .send({ message: "An email address is required." });
  }
  return bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((user) =>
        res.send({ name: user.name, avatar: user.avatar, email: user.email })
      )
      .catch((err) => {
        if (err.code === 11000) {
          res.status(conflictError).send({ message: "Email already exists." });
        } else if (err.name === "ValidationError" || err.name === "CastError") {
          res
            .status(invalidData)
            .send({ message: "An error has occurred creating user." });
        } else {
          res.status(defaultError).send({ message: defaultErrorMessage });
        }
      })
  );
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(invalidData)
      .send({ message: "The email and password fields are required." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(unauthorizedError)
          .send({ message: "Incorrect email or password." });
      } else {
        res.status(defaultError).send({ message: defaultErrorMessage });
      }
    });
};

const updateUserProfile = (req, res) => {
  const { userId } = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(idNotFound).send({ message: "User not found." });
      } else if (err.name === "ValidationError") {
        res
          .status(invalidData)
          .send({ message: "Incorrect user information." });
      } else {
        res.status(defaultError).send({ message: defaultErrorMessage });
      }
    });
};

module.exports = {
  getCurrentUser,
  updateUserProfile,
  createUser,
  login,
};
