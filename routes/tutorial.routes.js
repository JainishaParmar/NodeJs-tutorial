const express = require('express');

const router = express.Router();
const {
  createTutorial, getTutorial, updateTutorial, deleteTutorial, getTutorialById,
} = require('../controllers/tutorial.controller');

router.post("/create", createTutorial);
router.get("/getTutorial", getTutorial);
router.get("/getTutorialById/:id", getTutorialById);
router.put("/updateTutorial/:id", updateTutorial);
router.delete("/deleteTutorial/:id", deleteTutorial);
module.exports = router;
