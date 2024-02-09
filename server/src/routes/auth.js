const { checkIsAuthenticated } = require("../../passportConfig");
const { register, login, logout, loginSuccess, loginFailure } = require("../controllers/auth");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/login/success", loginSuccess);
router.get("/login/failure", loginFailure);
router.get("/isAuthenticated", checkIsAuthenticated);

module.exports = router;
