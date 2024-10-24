const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("The id string is in an invalid format"));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The id string is not found"));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((user) =>
        res.send({ name: user.name, avatar: user.avatar, email: user.email })
      )
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError("Email already exists"));
        } else if (err.name === "ValidationError" || err.name === "CastError") {
          next(new BadRequestError("An error has occurred creating user"));
        } else {
          next(err);
        }
      })
  );
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" }),
      });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      } else {
        next(err);
      }
    });
};

const updateUserProfile = (req, res, next) => {
  const userId = req.user._id;
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
        next(new NotFoundError("Id not found"));
      } else if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid information"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCurrentUser,
  updateUserProfile,
  createUser,
  login,
};
