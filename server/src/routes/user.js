const { updateUserAccount, updateUserProfile, deleteUser } = require("../controllers/user");
const friendRequestRouter = require("./friendRequest");
const router = require("express").Router();

router.use((req, res, next) => {
  req.isAuthenticated() ? next() : res.sendStatus(401);
});

router.put("/account", updateUserAccount);
router.put("/profile", updateUserProfile);
router.delete("/", deleteUser);
router.use("/friendRequest", friendRequestRouter);

module.exports = router;
