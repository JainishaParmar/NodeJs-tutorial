const { CastError } = require("mongoose");
const Tutorial = require("../models/tutorial.schema");
const { postTutorialSchema } = require("../validation/tutorial.validation");

const logger = require("../config/logger");

// get All Tutorials
const getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({
      createdAt: -1,
    });
    res.status(200).send(tutorials);
  } catch (error) {
    logger.error("Couldn't get all tutorials", error);
    res.status(500).send({ message: "Internal server error" });
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
    res.status(201).send(tutorial);
  } catch (error) {
    if (error instanceof CastError) {
      res.status(400).send({ message: "Invalid Tutorial details" });
    } else {
      logger.error("Couldn't create a tutorial", error);
      res.status(500).send({ message: "Internal Server Error" });
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
    } else {
      res.status(204).send();
    }
  } catch (error) {
    if (error instanceof CastError) {
      res.status(404).send({ message: "Tutorial not found" });
    } else {
      logger.error("Couldn't update a tutorial", error);
      res.status(500).send({ message: "Internal Server Error" });
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
    } else {
      res.status(200).send();
    }
  } catch (error) {
    if (error instanceof CastError) {
      res.status(404).send({ message: "Tutorial not found" });
    } else {
      logger.error("Couldn't delete a tutorial", error);
      res.status(500).send({ message: "Internal Server Error" });
    }
  }
};

// Able to search by Id
const getTutorialById = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (tutorial === null) {
      res.status(404).send({ message: "Tutorial not found" });
    } else {
      res.status(200).send(tutorial);
    }
  } catch (error) {
    if (error instanceof CastError) {
      res.status(404).send({ message: "Tutorial not found" });
    } else {
      logger.error("Couldn't get a tutorial by id", error);
      res.status(500).send({ message: "Internal Server Error" });
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
