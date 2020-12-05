require('dotenv').config()
const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const db = require('./src/services/db');

const app = express();
const port = process.env.PORT || 3000;

// Set up middleware for request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cross-Origin Resource Sharing
app.use(cors());

// Load up the routes
app.use(routes);

// Start the API
app.listen(port);
console.log(`Server is listening on port ${port}`);