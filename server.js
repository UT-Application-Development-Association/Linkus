// Load config
const config = require('./config');

// Connect to mongoDB
const { mongoose } = require('./mongoose');
mongoose.set('bufferCommands', false);


// Start app
console.log("Starting application...");
const { app } = require('./app');
app.listen(config.express.port, (error) => {
    if (error) {
        console.log("Unable to listen for connections", error);
    }
    console.log(`Listening on port ${config.express.port}`);
})

