const router = require('express').Router();
const searchRouter = require('./search/router');
const movieRouter = require('./movie/router');
const tvRouter = require('./tv/router');
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const roleGuard = require('../../middlewares/role-guard').admin;

router.use(authGuard);
router.use(roleGuard);
router.use('/search', searchRouter);
router.use('/movie', movieRouter);
router.use('/tv', tvRouter);
router.get('/', controller.index);

module.exports = router;