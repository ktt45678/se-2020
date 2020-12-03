const router = require('express').Router();
const exampleMiddleware = require('./src/middlewares/example');
const errors = require('./src/modules/errors');
const index = require('./src/routes/index/router');
const login = require('./src/routes/login/router');

// Wire up middleware
router.use(exampleMiddleware);

// Wire up routers
router.use('/', index);
router.use('/login', login);

// Wire up error-handling middleware
router.use(errors.errorHandler);
router.use(errors.nullRoute);

module.exports = router;