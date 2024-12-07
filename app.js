// Core Modules
const path = require('path');
require('dotenv').config();
const morgan = require('morgan');
const fs = require('fs');

const helmet = require('helmet');
const compression = require('compression');

// Third-Party Modules
const express = require('express');
const bodyParser = require('body-parser');


// Local Modules
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

const mongoConnect = require('./util/database').mongoConnect;

// Initialize Express App
const app = express();

// Middleware
// Parse JSON bodies
app.use(bodyParser.json());

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

app.use(morgan('combined',{ stream: accessLogStream }))
app.use(helmet());
app.use(compression());

// Serve static files for images
app.use('/images', express.static(path.join(__dirname, 'images')));


// CORS Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        // Respond OK for preflight requests
        return res.status(200).end();
    }
    
    next();
});

// Routes
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

// Global Error Handling Middleware
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    console.log(error);
    res.status(status).json({ message: message, data:data});
});
console.log(process.env.NODE_ENV)
// Connect to MongoDB and Start Server
console.log('MongoURL:', process.env.Mongo_URL);
mongoConnect(() => {
 
    app.listen(process.env.PORT || 8080, () => {
        console.log('Server is listening on port 8080');
    });
});
