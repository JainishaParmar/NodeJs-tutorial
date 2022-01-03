const mangoose = require('mongoose');
require('dotenv').config();

const promise = mangoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

module.exports = { promise, mangoose };
