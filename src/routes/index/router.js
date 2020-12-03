// Router
const router = require('express').Router();
const controller = require('./controller');

// Index route
router.get('/', controller);

// Export the router
module.exports = router;