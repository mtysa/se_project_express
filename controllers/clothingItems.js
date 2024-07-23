const Item = require("../models/clothingItem");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => res.status(500).send({ message: "Error" }));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl })
    .then((item) => res.send({ data: item }))
    .catch((err) => res.status(500).send({ message: "Error" }));
};

const deleteItem = (req, res) => {
  Item.findByIdAndRemove(req.params.id)
    .then((item) => res.send({ data: item }))
    .catch((err) => res.status(500).send({ message: "Error" }));
};

module.exports = { getItems, createItem, deleteItem };
