const {
  changeVisibleStatus,
  getVisibleChats,
  getChat,
  addMessage,
} = require("../controllers/chat");

const router = require("express").Router();

router.use((req, res, next) => {
  req.isAuthenticated() ? next() : res.sendStatus(401);
});
router.get("/visible", getVisibleChats);
router.put("/visible", changeVisibleStatus);
router.get("/:username", getChat);
router.put("/message", addMessage);

module.exports = router;
