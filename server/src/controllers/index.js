const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const updateUserAccount = [
  body("currentPassword")
    .escape()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Current password must be at least 8 characters")
    .custom(async (currentPassword, { req }) => {
      if (!(await bcrypt.compare(currentPassword, req.user.password)))
        throw new Error("Current password does not match");
    }),
  body("email")
    .optional({ values: "falsy" })
    .escape()
    .trim()
    .custom(async (email, { req }) => {
      if (email === req.user.email) return true;
      if (await User.findOne({ email })) throw new Error("Email already exists");
    }),
  body("password")
    .optional({ values: "falsy" })
    .escape()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const { email, password } = req.body;
      if (!email && !password) return res.json(false);

      const hashedPassword = await bcrypt.hash(password, 10);
      const update = !email
        ? { password: hashedPassword }
        : !password
        ? { email }
        : { email, password: hashedPassword };

      await User.findByIdAndUpdate(req.user._id, update);
      res.json(false);
    } else {
      const organizedErrors = {
        currentPassword: [],
        email: [],
        password: [],
      };

      for (const error of errors.array()) organizedErrors[error.path].push(error.msg);

      res.json(organizedErrors);
    }
  },
];

const updateUserProfile = [
  body("username")
    .escape()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .custom(async (username, { req }) => {
      if (username === req.user.username) return true;
      if (await User.findOne({ username })) throw new Error("Username already exists");
    }),
  body("status").trim().isLength({ max: 40 }).withMessage("Must be less than 40 characters"),
  body("about").trim().isLength({ max: 190 }).withMessage("Must be less than 190 characters"),

  async (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      await User.findByIdAndUpdate(req.user._id, req.body);
      res.json(false);
    } else {
      const organizedErrors = {
        username: [],
        status: [],
        about: [],
      };

      for (const error of errors.array()) organizedErrors[error.path].push(error.msg);

      res.json(organizedErrors);
    }
  },
];

const deleteUser = [
  body("currentPassword")
    .escape()
    .trim()
    .isLength({ min: 8 })
    .withMessage("Current password must be at least 8 characters")
    .custom(async (currentPassword, { req }) => {
      if (!(await bcrypt.compare(currentPassword, req.user.password)))
        throw new Error("Current password does not match");
    }),

  async function deleteUser(req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      await User.findByIdAndDelete(req.user._id);

      res.json(false);
    } else {
      res.json(errors.array());
    }
  },
];

module.exports = {
  updateUserAccount,
  updateUserProfile,
  deleteUser,
};
