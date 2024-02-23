const { checkAvatarExists, getAvatar } = require("../../s3");
const User = require("../models/User");

async function getFriends(req, res) {
  let user = await User.findById(req.user._id).populate("friends");
  user = JSON.parse(JSON.stringify(user));

  let friends;
  if (req.query.type === "all") friends = user.friends;
  else if (req.query.type === "online")
    friends = user.friends.filter((friend) => friend.visibility !== "offline");

  for (let i = 0; i < friends.length; i++) {
    const friend = friends[i];
    const avatarExists = await checkAvatarExists(`users/${friend._id}`);
    if (avatarExists) friend.avatar = await getAvatar(`users/${friend._id}`);
  }

  res.json(friends);
}

async function removeFriend(req, res) {
  const user = req.user;
  const userToRemove = await User.findById(req.params.userId);

  user.friends = user.friends.filter((value) => !value.equals(userToRemove._id));
  await user.save();

  userToRemove.friends = userToRemove.friends.filter((value) => !value.equals(user._id));
  await userToRemove.save();

  res.end();
}

module.exports = {
  getFriends,
  removeFriend,
};
