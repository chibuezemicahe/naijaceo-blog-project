// Core Modules
const path = require('path');

// Third-Party Modules
const express = require('express');
const bodyParser = require('body-parser');

// Local Modules
const router = require('./routes/feed');
const mongoConnect = require('./util/database').mongoConnect;

// Initialize Express App
const app = express();

// Middleware
// Parse JSON bodies
app.use(bodyParser.json());

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
app.use('/feed', router);

// Global Error Handling Middleware
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({ message: message });
});

// Connect to MongoDB and Start Server
mongoConnect(() => {
    app.listen(8080, () => {
        console.log('Server is listening on port 8080');
    });
});
