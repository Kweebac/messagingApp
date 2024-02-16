const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const passport = require("passport");

const register = [
  body("email").escape().trim(),
  body("password")
    .escape()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("username")
    .escape()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .custom(async (username) => {
      if (await User.findOne({ username })) throw new Error("Username already exists");
    }),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        const { email, password, username } = req.body;

        await User.create({
          email,
          password: await bcrypt.hash(password, 10),
          username,
        });

        res.json(true);
      } else {
        res.json(errors.array());
      }
    } catch (err) {
      next(err);
    }
  },
];

const login = [
  body("email").escape().trim(),
  body("password").escape().trim(),
  passport.authenticate("local", {
    successRedirect: "/api/auth/login/success",
    failureRedirect: "/api/auth/login/failure",
    failureMessage: true,
  }),
];

function logout(req, res) {
  req.logout((err) => {
    err ? res.json(false) : res.json(true);
  });
}

function loginSuccess(req, res) {
  res.json(true);
}

function loginFailure(req, res) {
  const errors = req.session.messages;
  res.json(errors[errors.length - 1]);
}

async function getUser(req, res) {
  res.json(req.user);
}

module.exports = {
  register,
  login,
  logout,
  loginSuccess,
  loginFailure,
  getUser,
};
