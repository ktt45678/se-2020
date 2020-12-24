const router = require('express').Router();
const controller = require('./controller');
const validator = require('../../modules/validator');
const authGuard = require('../../middlewares/auth-guard');

router.use(authGuard);
router.get('/', controller.view);
router.put('/', validator.userUpdateRules(), controller.update);

module.exports = router;