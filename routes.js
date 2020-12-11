const router = require('express').Router();
const errors = require('./src/modules/errors');
const index = require('./src/routes/index/router');
const login = require('./src/routes/login/router');
const register = require('./src/routes/register/router');

// Wire up routers
router.use('/', index);
router.use('/login', login);
router.use('/register', register);

// Wire up error-handling middleware
router.use(errors.errorHandler);
router.use(errors.nullRoute);

module.exports = router;