const config = {};

config.express = {
    port: process.env.PORT  || 8888,
    ip: process.env.EXPRESS_IP || 'localhost',
}

config.mongodb = {
    // Find actual uri of MongoDB Altas on Youtrack -> Knowledge Base -> MongoDB
    url:  process.env.MONGODB_URL || "mongodb://localhost:27017/Linkus"
}

module.exports = config;