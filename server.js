require('dotenv').config()
const express = require('express');
const helmet = require('helmet');
const routes = require('./routes');
const cors = require('./src/middlewares/cors');
const config = require('./src/modules/config.json');
const db = require('./src/services/db');

const app = express();
const port = process.env.PORT || config.port;

// Set up middleware for enabling cors and helmet
app.use(helmet());
app.use(cors);

// Set up middleware for request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load up the routes
app.use(routes);

// Start the API
app.listen(port);
console.log(`Server is listening on port ${port}`);