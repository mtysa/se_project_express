const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getItems,
  addItem,
  deleteItem,
  addCardLike,
  removeCardLike,
} = require("../controllers/clothingItems");
const { validateId, validateCardBody } = require("../middlewares/validation");

router.get("/", getItems);
router.use(auth);
router.post("/", validateCardBody, addItem);
router.delete("/:itemId", validateId, deleteItem);
router.put("/:itemId/likes", validateId, addCardLike);
router.delete("/:itemId/likes", validateId, removeCardLike);

module.exports = router;
