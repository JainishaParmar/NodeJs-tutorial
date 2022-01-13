const router = require("express").Router();
const {
  userLogin, restPassword, sendEmail, forgetPassword,
} = require("../controllers/oauth.controller");

router.post("/token", userLogin);
router.patch("/reset-password", restPassword);
router.post("/forgot-password", sendEmail);
router.patch("/forgot-password", forgetPassword);
module.exports = router;
