const User = require("../models/user");
const {
  invalidData,
  idNotFound,
  defaultError,
  defaultErrorMessage,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(defaultError).send({ defaultErrorMessage });
      } else {
        res.status(defaultError).send({ defaultErrorMessage });
      }
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(idNotFound)
          .send({ message: "An error has occured with the requested ID." });
      } else {
        res.status(defaultError).send({ defaultErrorMessage });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res
          .status(invalidData)
          .send({ message: "An error has occured creating user." });
      } else {
        res.status(defaultError).send({ defaultErrorMessage });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
