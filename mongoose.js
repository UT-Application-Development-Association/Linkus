const mongoose = require('mongoose');
const config = require('./config');

// console.log(config.mongodb.url);

console.log("Connecting to database...");
mongoose.connect(config.mongodb.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected.");
}).catch(err => {
    console.log("Cannot connect to database.", err);
});

module.exports = { mongoose };