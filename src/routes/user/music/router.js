const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');
const validator = require('../../../middlewares/validator');
const authGuard = require('../../../middlewares/auth-guard');
const rateLimiter = require('../../../middlewares/rate-limiter');

router.get('/', authGuard({ bypass: true }), validator.viewUserRules(), controller.view);

router.use(authGuard());
router.post('/', rateLimiter(300), controller.upload);
router.delete('/', controller.delete);

module.exports = router;