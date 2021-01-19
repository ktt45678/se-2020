const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const roleGuard = require('../../middlewares/role-guard');
const validator = require('../../middlewares/validator');

router.use(authGuard);
router.use(roleGuard.regular);
router.get('/:id/check', validator.checkRatingRules(), controller.check);
router.get('/:id/count', validator.countRatingRules(), controller.count);
router.post('/:id/rate', validator.ratingRules(), controller.rate);

module.exports = router;