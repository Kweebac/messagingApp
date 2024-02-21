const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const cors = require("cors");
const userRouter = require("./src/routes/user");
const authRouter = require("./src/routes/auth");

require("./mongooseConfig");
require("./passportConfig");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.listen(3000);
