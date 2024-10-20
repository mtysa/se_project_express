const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { idNotFound } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const {
  validateUserLogin,
  validateUserBody,
} = require("../middlewares/validation");

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserBody, createUser);

router.use("/users", auth, userRouter);
router.use("/items", itemRouter);
router.use((req, res) => {
  res.status(idNotFound).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
