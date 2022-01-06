const router = require("express").Router();
const { createUser, updateUser } = require("../controllers/user.controller");

router.post("/", createUser);
router.patch('/:id', updateUser);

module.exports = router;
