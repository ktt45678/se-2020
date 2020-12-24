const router = require('express').Router();
const errors = require('./src/modules/errors');
const index = require('./src/routes/index/router');
const auth = require('./src/routes/auth/router');
const user = require('./src/routes/user/router');
const movie = require('./src/routes/movie/router');

// Wire up routers
router.use('/', index);
router.use('/auth', auth);
router.use('/user', user);
router.use('/movie', movie);

// Wire up error-handling middleware
router.use(errors.errorHandler);
router.use(errors.nullRoute);

module.exports = router;