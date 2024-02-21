const { sendFriendRequest, acceptFriendRequest } = require("../controllers/friendRequest");
const router = require("express").Router();

router.put("/send", sendFriendRequest);
router.put("/accept", acceptFriendRequest);

module.exports = router;
