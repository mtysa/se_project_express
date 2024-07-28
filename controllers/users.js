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
    .catch((err) => res.status(defaultError).send({ defaultErrorMessage }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) =>
      res
        .status(idNotFound)
        .send({ message: "An error has occured with the requested ID." })
    );
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(invalidData)
          .send({ message: "An error has occured creating user." });
      } else {
        res.status(defaultError).send({ defaultErrorMessage });
      }
    });
};

module.exports = { getUsers, getUser, createUser };
