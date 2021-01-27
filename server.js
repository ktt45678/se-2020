require('dotenv').config()
require('./src/services/db');
require('./src/services/redis');
const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');
const cors = require('cors');
const config = require('./config.json').server;

const app = express();
const port = process.env.PORT || config.port;

// Set up middleware for enabling cors and helmet
app.use(helmet.hsts());
app.use(helmet.noSniff());
app.use(cors());

// Set up middleware for request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load up the routes
app.use(routes);

// Start the API
app.listen(port);
console.log(`Server is listening on port ${port}`);