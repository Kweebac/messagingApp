const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const sendFriendRequest = [
  body("username")
    .escape()
    .trim()
    .custom(async (username, { req }) => {
      if (username === req.user.username) throw new Error("You can't friend yourself...");
      if (!(await User.findOne({ username }))) throw new Error("Username doesn't exist");

      const friendedUser = await User.findOne({ username });
      if (req.user.friendRequests.outbound.includes(friendedUser._id))
        throw new Error("You've already sent a friend request");
      if (req.user.friends.includes(friendedUser._id))
        throw new Error("You're already friends");
    }),
  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { username } = req.body;
      const friendedUser = await User.findOne({ username });

      friendedUser.friendRequests.inbound.push(req.user._id);
      await friendedUser.save();

      req.user.friendRequests.outbound.push(friendedUser._id);
      await req.user.save();

      res.json(false);
    } else res.send(errors.array());
  },
];

function acceptFriendRequest(req, res) {
  console.log(req.body);
  res.end();
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
};
