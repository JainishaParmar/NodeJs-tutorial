const { CastError } = require("mongoose");
const Tutorial = require("../models/tutorial.schema");
const { postTutorialSchema } = require("../validation/tutorial.validation");
const logger = require("../config/tutorial.winston");

// get All Tutorials
const getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({
      createdAt: -1,
    });
    res.status(200).send(tutorials);
    logger.tutorialLogger.log('info', 'Get all tutorials');
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
    logger.tutorialLogger.log('error', 'Internal server error');
  }
};

// Add new Tutorials
const createTutorial = async (req, res) => {
  try {
    const { error, value } = postTutorialSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const tutorial = new Tutorial(value);
    await tutorial.save();
    res.status(201).send();
    logger.tutorialLogger.log('info', 'New tutorial created');
  } catch (error) {
    if (error instanceof CastError) {
      res.status(400).send({ message: "Invalid Tutorial details" });
      logger.tutorialLogger.log('error', 'Invalid Tutorial details');
    } else {
      res.status(500).send({ message: "Internal Server Error" });
      logger.tutorialLogger.log('error', 'Internal Server Error');
    }
  }
  return null;
};

// Update a Tutorial by ID
const updateTutorial = async (req, res) => {
  try {
    const { error, value } = postTutorialSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const tutorial = await Tutorial.findByIdAndUpdate(
      { _id: req.params.id },
      value,
    );
    if (tutorial === null) {
      res.status(404).send({ message: "Tutorial not found" });
      logger.tutorialLogger.log('error', 'Tutorial not found');
    } else {
      res.status(204).send();
      logger.tutorialLogger.log('info', 'Tutorial updated');
    }
  } catch (error) {
    if (error instanceof CastError) {
      res.status(404).send({ message: "Tutorial not found" });
      logger.tutorialLogger.log('error', 'tutorial not found');
    } else {
      res.status(500).send({ message: "Internal Server Error" });
      logger.tutorialLogger.log('error', 'Internal Server Error');
    }
  }
  return null;
};

// Delete a Tutorial by ID
const deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);

    if (tutorial === null) {
      res.status(404).send({ message: "Tutorial not found" });
      logger.tutorialLogger.log('error', 'Tutorial not found');
    } else {
      res.status(200).send();
      logger.tutorialLogger.log('info', 'Tutorial deleted');
    }
  } catch (error) {
    if (error instanceof CastError) {
      res.status(404).send({ message: "Tutorial not found" });
      logger.tutorialLogger.log('error', 'Tutorial not found');
    } else {
      res.status(500).send({ message: "Internal Server Error" });
      logger.tutorialLogger.log('error', 'Internal Server Error');
    }
  }
};

// Able to search by Id
const getTutorialById = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (tutorial === null) {
      res.status(404).send({ message: "Tutorial not found" });
      logger.tutorialLogger.log('error', 'Tutorial not found');
    } else {
      res.status(200).send();
      logger.tutorialLogger.log('info', 'Tutorial get by id');
    }
  } catch (error) {
    if (error instanceof CastError) {
      res.status(404).send({ message: "Tutorial not found" });
      logger.tutorialLogger.log('error', 'Tutorial not found');
    } else {
      res.status(500).send({ message: "Internal Server Error" });
      logger.tutorialLogger.log('error', 'Internal Server Error');
    }
  }
};

module.exports = {
  getTutorials,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  getTutorialById,
};
