const {
  getFriendRequests,
  sendFriendRequest,
  declineFriendRequest,
  acceptFriendRequest,
} = require("../controllers/friendRequest");
const router = require("express").Router();

router.get("/", getFriendRequests);
router.put("/send", sendFriendRequest);
router.put("/decline/incoming", declineFriendRequest.incoming);
router.put("/decline/outgoing", declineFriendRequest.outgoing);
router.put("/accept", acceptFriendRequest);

module.exports = router;
