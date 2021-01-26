const router = require('express').Router();
const controller = require('./controller');
const avatarRouter = require('./avatar/router');
const backgroundRouter = require('./background/router');
const musicRouter = require('./music/router');
const validator = require('../../middlewares/validator');
const authGuard = require('../../middlewares/auth-guard');
const rateLimiter = require('../../middlewares/rate-limiter');

router.use(authGuard());
router.use('/:id?/avatar', validator.viewUserRules(), avatarRouter);
router.use('/:id?/background', validator.viewUserRules(), backgroundRouter);
router.use('/:id?/music', validator.viewUserRules(), musicRouter);
router.get('/:id?', validator.viewUserRules(), controller.view);
router.put('/', rateLimiter(120), validator.updateUserRules(), controller.update);

module.exports = router;