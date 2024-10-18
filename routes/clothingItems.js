const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getItems,
  addItem,
  deleteItem,
  addCardLike,
  removeCardLike,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.use(auth);
router.post("/", addItem);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", addCardLike);
router.delete("/:itemId/likes", removeCardLike);

module.exports = router;
