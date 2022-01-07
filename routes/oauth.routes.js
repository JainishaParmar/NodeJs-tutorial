const router = require("express").Router();
const { userLogin, restPassword } = require("../controllers/oauth.controller");

router.post("/token", userLogin);
router.patch("/reset-password", restPassword);
module.exports = router;
