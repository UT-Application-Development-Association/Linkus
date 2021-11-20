const express = require('express');
const cors = require('cors');
const { mongoose } = require('./mongoose');
const session = require("express-session");
const MongoStore = require('connect-mongo');
const path = require('path');

const app = express();
/** Setup middlewares (ORDER MATTERS!!!!!!!!) */
// 0. Static resources
app.use(express.static(path.join(__dirname, "/frontend/build")));

// 1. setup session handler
app.set('trust proxy', 1);
app.use(session({
    secret: process.env.SESSION_SECRET || "some random hash key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 * 24, // 24 hours
        httpOnly: true,
        sameSite: 'none',
        secure: true
    },
    // store the sessions on the database in production
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URL
    })
}));




// 2. Setup cors
app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true
}));
// 3. Setup body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// 4. Setup database checker
app.use((req, res, next) => {
    if (mongoose.connection.readyState !== mongoose.ConnectionStates.connected) {
        res.status(500).json("Unable to connect to database.");
        return;
    }
    // Continue processing other middlewares
    next();
})
// 5. Setup routers
// ============================================================
app.use("/api", require('./controllers/account').router);
app.use("/api", require('./controllers/task').router);
app.use("/api", require('./controllers/project').router);
app.use("/api", require('./controllers/report').router);

// ADD OTHER ROUTERS ABOVE ↑
// ============================================================

// 6. FINALLY, handle 404 error.
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
})


/**  export app */
module.exports = { app };