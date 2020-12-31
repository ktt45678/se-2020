const router = require('express').Router();
const controller = require('./controller');
const avatarRouter = require('./avatar/router');
const backgroundRouter = require('./background/router');
const musicRouter = require('./music/router');
const validator = require('../../middlewares/validator');
const authGuard = require('../../middlewares/auth-guard');
const rateLimiter = require('../../middlewares/rate-limiter');

router.use(authGuard);
router.use('/:id?/avatar', avatarRouter);
router.use('/:id?/background', backgroundRouter);
router.use('/:id?/music', musicRouter);
router.get('/:id?', controller.view);
router.put('/', rateLimiter(120), validator.userUpdateRules(), controller.update);

module.exports = router;