
const Item = require("../models/clothingItem");
const {
  invalidData,
  defaultError,
  idNotFound,
  defaultErrorMessage,
} = require("../utils/errors");

const getItems = (req, res) => {
  console.log(res);
  Item.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => res.status(defaultError).send({ defaultErrorMessage }));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl })
    .then((item) => res.send({ data: item }))
    .catch((err) =>
      res
        .status(invalidData)
        .send({ message: "An error has occured creating item." })
    );
};

const deleteItem = (req, res) => {
  Item.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => res.send({}))
    .catch((err) =>
      res
        .status(invalidData)
        .send({ message: "An error has occured deleting item." })
    );
};

//LIKES
const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) =>
      res
        .status(invalidData)
        .send({ message: "An error has occured liking item." })
    );
};

//UNLIKE
const unlikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) =>
      res
        .status(invalidData)
        .send({ message: "An error has occured unliking item." })
    );
};

module.exports = { getItems, createItem, deleteItem, likeItem, unlikeItem };
