const router = require("express").Router();
const {
  getTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial,
} = require("../controllers/tutorial.controller");
/* GET users listing. */
router.get("/", getTutorials);
router.get("/:Id", getTutorialById);
router.post("/", createTutorial);
router.patch("/:Id", updateTutorial);
router.delete("/:Id", deleteTutorial);
module.exports = router;
