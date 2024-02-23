const mongoose = require("mongoose");

module.exports = mongoose.model(
  "User",
  mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    displayname: { type: String, required: true, unique: true },
    username: {
      type: String,
      required: true,
      default: function () {
        return this.displayname.toLowerCase();
      },
      unique: true,
    },
    visibility: { type: String, default: "offline", required: true },
    status: { type: String, default: "" },
    about: { type: String, default: "" },
    friends: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    friendRequests: {
      incoming: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
      outgoing: [{ type: mongoose.SchemaTypes.ObjectId, ref: "User" }],
    },
    chats: {
      users: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Chat" }],
      groups: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Chat" }],
    },
  })
);
