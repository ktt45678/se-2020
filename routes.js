const router = require('express').Router();
const errors = require('./src/middlewares/errors');
const index = require('./src/routes/index/router');
const auth = require('./src/routes/auth/router');
const user = require('./src/routes/user/router');
const tmdb = require('./src/routes/tmdb/router');
const media = require('./src/routes/media/router');
const drive = require('./src/routes/drive/router');
const rating = require('./src/routes/rating/router');

// Wire up routers
router.use('/', index);
router.use('/auth', auth);
router.use('/user', user);
router.use('/tmdb', tmdb);
router.use('/media', media);
router.use('/drive', drive);
router.use('/rating', rating);

// Wire up error-handling middleware
router.use(errors.errorHandler);
router.use(errors.nullRoute);

module.exports = router;