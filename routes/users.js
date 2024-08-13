const router = require("express").Router();
const { getCurrentUser, updateUserProfile } = require("../controllers/users");
const { auth } = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", updateUserProfile);

module.exports = router;
