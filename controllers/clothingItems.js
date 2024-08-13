const Item = require("../models/clothingItem");
const {
  invalidData,
  idNotFound,
  defaultError,
  defaultErrorMessage,
  forbiddenError,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => {
      console.error(err);
      res.status(defaultError).send({ defaultErrorMessage });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(invalidData)
          .send({ message: "An error has occurred creating item." });
      } else {
        res.status(defaultError).send({ defaultErrorMessage });
      }
    });
};

const deleteItem = (req, res) => {
  const { userId } = req.params._id;

  Item.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        res
          .status(forbiddenError)
          .send({ message: "You do not have permission to delete this item." });
      } else {
        res.send(item);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        res
          .status(invalidData)
          .send({ message: "An error has occurred deleting item." });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(idNotFound)
          .send({ message: "An error has occurred deleting item." });
      } else {
        res.status(defaultError).send({ defaultErrorMessage });
      }
    });
};

// LIKES
const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(invalidData)
          .send({ message: "An error has occurred liking item." });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(idNotFound)
          .send({ message: "An error has occurred liking item." });
      } else {
        res.status(defaultError).send({ defaultErrorMessage });
      }
    });
};

// UNLIKE
const unlikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(invalidData)
          .send({ message: "An error has occurred unliking item." });
      }
      if (err.name === "DocumentNotFoundError") {
        res
          .status(idNotFound)
          .send({ message: "An error has occurred unliking item." });
      } else {
        res.status(defaultError).send({ defaultErrorMessage });
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
