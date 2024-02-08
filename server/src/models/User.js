const mongoose = require("mongoose");

module.exports = mongoose.model(
  "User",
  mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    visibility: { type: String, default: "offline", required: true },
    avatar: { type: String, default: "temp", required: true },
    status: String,
    about: String,
    friends: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    chats: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Chat" }],
    groups: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Chat" }],
  })
);
