/* eslint-disable no-console */
const { response } = require('express');
const { Tutorial } = require('../models/tutorial.schema');
const mangoose = require('../init/db');

// create Document or insert
const createTutorial = async (req, res) => {
  try {
    const demoTutorial = new Tutorial({
      id: "1",
      published: true,
    });
    const result = await demoTutorial.save();
    // eslint-disable-next-line no-console
    console.log(result);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

const getTutorialById = async (req, res) => {
  const findId = req.params.id;
  try {
    const tutorials = await Tutorial.find({ id: findId });
    res.json(tutorials);
  } catch (error) {
    res.json({ message: error });
  }
};

const getTutorial = async (req, res) => {
  try {
    const tutorials = await Tutorial.find();
    res.json(tutorials);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("error");
  }
};

const getUpdateTutorial = async (data) => {
  try {
    const updateData = await Tutorial.update({ id: data }, { $set: { id: "2" } }).exec();
    console.log(updateData);
  } catch (error) {
    console.log("error", error);
  }
};

const updateTutorial = async (req, res) => {
  const data = req.params.id;
  const tutorial = await getUpdateTutorial(data);
  res.json(tutorial);
};

const deleteById = async (deleteId) => {
  try {
    const deleteData = await Tutorial.findAndDelete({ id: deleteId });
    console.log(deleteData);
  } catch (error) {
    console.log("error", error);
  }
};

const deleteTutorial = async (req, res) => {
  const deleteId = req.params.id;
  const tutorial = await deleteById(deleteId);
  res.json(tutorial);
};

module.exports = {
  createTutorial, getTutorial, updateTutorial, deleteTutorial, getTutorialById,
};
