const { updateUserAccount, updateUserProfile, deleteUser } = require("../controllers");

const router = require("express").Router();

router.put("/user/account", updateUserAccount);
router.put("/user/profile", updateUserProfile);
router.delete("/user", deleteUser);

module.exports = router;
