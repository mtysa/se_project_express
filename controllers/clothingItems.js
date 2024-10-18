const Item = require("../models/clothingItem");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send({ data: items }))
    .catch(next);
};

const addItem = (req, res, next) => {
  const { name, imageUrl, weather } = req.body;
  Item.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const userId = req.user._id;

  Item.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res
          .status(ForbiddenError)
          .send({ message: "You do not have permission to delete this item." });
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted successfully." }));
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        next(new BadRequestError("An error has occurred deleting item"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The id string is not found"));
      } else {
        next(err);
      }
    });
};

// LIKES
const addCardLike = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("An error has occurred liking item"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The id string is not found"));
      } else {
        next(err);
      }
    });
};

// UNLIKE
const removeCardLike = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("An error has occurred unliking item"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The id string is not found"));
      } else {
        next(err);
      }
    });
};

// const getItems = (req, res) => {
//   Item.find({})
//     .then((items) => res.send({ data: items }))
//     .catch((err) => {
//       console.error(err);
//       res.status(defaultError).send({ message: defaultErrorMessage });
//     });
// };

// const addItem = (req, res) => {
//   const { name, imageUrl, weather } = req.body;
//   Item.create({ name, imageUrl, weather, owner: req.user._id })
//     .then((item) => res.send({ data: item }))
//     .catch((err) => {
//       if (err.name === "ValidationError") {
//         res
//           .status(invalidData)
//           .send({ message: "An error has occurred creating item." });
//       } else {
//         res.status(defaultError).send({ message: defaultErrorMessage });
//       }
//     });
// };

// const deleteItem = (req, res) => {
//   const userId = req.user._id;

//   Item.findById(req.params.itemId)
//     .orFail()
//     .then((item) => {
//       if (item.owner.toString() !== userId) {
//         return res
//           .status(forbiddenError)
//           .send({ message: "You do not have permission to delete this item." });
//       }
//       return item
//         .deleteOne()
//         .then(() => res.send({ message: "Item deleted successfully." }));
//     })
//     .catch((err) => {
//       if (err.name === "ValidationError" || err.name === "CastError") {
//         res
//           .status(invalidData)
//           .send({ message: "An error has occurred deleting item." });
//       } else if (err.name === "DocumentNotFoundError") {
//         res
//           .status(idNotFound)
//           .send({ message: "An error has occurred deleting item." });
//       } else {
//         res.status(defaultError).send({ message: defaultErrorMessage });
//       }
//     });
// };

// // LIKES
// const addCardLike = (req, res) => {
//   Item.findByIdAndUpdate(
//     req.params.itemId,
//     { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
//     { new: true }
//   )
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((err) => {
//       if (err.name === "CastError") {
//         res
//           .status(invalidData)
//           .send({ message: "An error has occurred liking item." });
//       } else if (err.name === "DocumentNotFoundError") {
//         res
//           .status(idNotFound)
//           .send({ message: "An error has occurred liking item." });
//       } else {
//         res.status(defaultError).send({ message: defaultErrorMessage });
//       }
//     });
// };

// // UNLIKE
// const removeCardLike = (req, res) => {
//   Item.findByIdAndUpdate(
//     req.params.itemId,
//     { $pull: { likes: req.user._id } }, // remove _id from the array
//     { new: true }
//   )
//     .orFail()
//     .then((item) => res.status(200).send({ data: item }))
//     .catch((err) => {
//       if (err.name === "CastError") {
//         res
//           .status(invalidData)
//           .send({ message: "An error has occurred unliking item." });
//       } else if (err.name === "DocumentNotFoundError") {
//         res
//           .status(idNotFound)
//           .send({ message: "An error has occurred unliking item." });
//       } else {
//         res.status(defaultError).send({ message: defaultErrorMessage });
//       }
//     });
// };

module.exports = { getItems, addItem, deleteItem, addCardLike, removeCardLike };
