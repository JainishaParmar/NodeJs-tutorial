const Tutorial = require("../models/tutorial.schema");

// get All Tutorials
const getTutorials = async (req, res) => {
  try {
    const tutorials = await Tutorial.find().sort({
      createdAt: -1,
    });
    res.json(tutorials);
    res.status(200).send();
  } catch (error) {
    res.status(404).send();
  }
};

// Add new Tutorials
const createTutorial = async (req, res) => {
  const tutorial = new Tutorial({
    title: req.body.title,
    description: req.body.description,
    published: req.body.published,
  });
  try {
    const savedTutorial = await tutorial.save();
    res.send(savedTutorial);
  } catch (error) {
    res.status(405).send(error);
  }
};

// Update a Tutorial by ID
const updateTutorial = async (req, res) => {
  try {
    const { title, description, published } = req.body;
    const update = {};
    if (typeof title !== "undefined") update.title = title;
    if (typeof description !== "undefined") update.description = description;
    if (typeof published !== "undefined") update.published = published;
    const tutorialUpdate = await Tutorial.findByIdAndUpdate(
      { _id: req.params.Id },
      update,
      { new: true },
    );
    res.json(tutorialUpdate);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

// Delete a Tutorial by ID
const deleteTutorial = async (req, res) => {
  try {
    const tutorialRemove = await Tutorial.findByIdAndDelete(req.params.Id);
    res.json(tutorialRemove);
    res.status(204).send();
  } catch (error) {
    res.status(400).send(error);
  }
};

// Able to search by Id
const getTutorialById = async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.Id);
    res.json(tutorial);
  } catch (error) {
    res.status(404).send({ message: "Tutorial not found" });
  }
};

module.exports = {
  getTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial,
};
