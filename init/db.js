const mangoose = require('mongoose');

const promise = mangoose.connect("mongodb://localhost:27017/tutorials", { useNewUrlParser: true });

module.exports = { promise, mangoose };
