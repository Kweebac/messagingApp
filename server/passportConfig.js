const User = require("./src/models/User");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const passport = require("passport");

passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).exec();

      if (user === null) done(null, false, { message: "No user with that email" });
      else if (!(await bcrypt.compare(password, user.password)))
        done(null, false, { message: "Password did not match" });
      else done(null, user);
    } catch (err) {
      done(err);
    }
  })
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (error) {
    done(error);
  }
});

function checkIsAuthenticated(req, res) {
  req.isAuthenticated() ? res.json(true) : res.json(false);
}

module.exports = {
  checkIsAuthenticated,
};
