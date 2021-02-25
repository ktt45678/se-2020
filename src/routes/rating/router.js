const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const roleGuard = require('../../middlewares/role-guard');
const validator = require('../../middlewares/validator');

router.get('/', controller.index);
router.get('/:mediaId/count', authGuard({ bypass: true }), validator.countRatingRules(), controller.count);

router.use(authGuard());
router.get('/:mediaId/check', validator.checkRatingRules(), controller.check);

router.use(roleGuard.regular);
router.post('/', validator.ratingRules(), controller.rate);

module.exports = router;