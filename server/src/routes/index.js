const { checkIsAuthenticated } = require("../../passportConfig");
const { register, login, loginSuccess, loginFailure } = require("../controllers");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.get("/login/success", loginSuccess);
router.get("/login/failure", loginFailure);
router.get("/isAuthenticated", checkIsAuthenticated);

module.exports = router;
