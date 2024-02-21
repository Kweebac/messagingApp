const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const sendFriendRequest = [
  body("username")
    .escape()
    .trim()
    .custom(async (username, { req }) => {
      if (username === req.user.username) throw new Error("You can't friend yourself...");
      if (!(await User.findOne({ username }))) throw new Error("Username doesn't exist");
    }),
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
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
