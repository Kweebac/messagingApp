const { getAvatar, checkAvatarExists } = require("../../s3");
const DM = require("../models/DM");
const User = require("../models/User");

async function getVisibleChats(req, res) {
  let user = await User.findById(req.user._id).populate("chats.users.friend");
  user = JSON.parse(JSON.stringify(user));

  const visibleChats = user.chats.users.filter((chat) => chat.visible);
  for (const visibleChat of visibleChats) {
    const avatarExists = await checkAvatarExists(`users/${visibleChat.friend._id}`);

    if (avatarExists)
      visibleChat.friend.avatar = await getAvatar(`users/${visibleChat.friend._id}`);
  }

  res.json(visibleChats);
}

async function changeVisibleStatus(req, res) {
  const user = req.user;
  const { otherUserId, visible } = req.body;
  const chat = await DM.findOne({ users: { $all: [user._id, otherUserId] } });

  for (const chatUser of user.chats.users) {
    if (chatUser.ref.equals(chat._id)) chatUser.visible = visible;
  }

  await user.save();

  res.end();
}

async function getChat(req, res) {
  let user = await User.findById(req.user._id, "chats").populate({
    path: "chats.users",
    populate: [
      { path: "friend", select: "displayname username status about visibility" },
      {
        path: "ref",
        select: "messages",
        populate: {
          path: "messages.user",
          select: "displayname",
        },
      },
    ],
  });
  user = JSON.parse(JSON.stringify(user));

  const chat = user.chats.users.filter(
    (chat) => chat.friend.username === req.params.username
  )[0];

  const avatarExists = await checkAvatarExists(`users/${chat.friend._id}`);
  if (avatarExists) chat.friend.avatar = await getAvatar(`users/${chat.friend._id}`);

  for (const messages of chat.ref.messages) {
    const avatarExists = await checkAvatarExists(`users/${messages.user._id}`);
    if (avatarExists) messages.user.avatar = await getAvatar(`users/${messages.user._id}`);
  }

  res.json(chat);
}

async function addMessage(req, res) {
  const { message, chatId } = req.body;

  const chat = await DM.findById(chatId);
  chat.messages.push({
    body: message,
    user: req.user._id,
  });

  await chat.save();

  res.end();
}

module.exports = {
  getVisibleChats,
  changeVisibleStatus,
  getChat,
  addMessage,
};
