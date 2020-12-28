const router = require('express').Router();
const controller = require('./controller');
const validator = require('../../middlewares/validator');
const authGuard = require('../../middlewares/auth-guard');
const authRefresh = require('../../middlewares/auth-refresh');

router.get('/', controller.index);
router.post('/login', validator.loginRules(), controller.login);
router.post('/register', validator.registrationRules(), controller.register);
router.post('/sendconfirmemail', authGuard, controller.sendConfirmEmail);
router.post('/sendrecoveryemail', validator.recoveryRules(), controller.sendRecoveryEmail);
router.post('/confirmemail', controller.confirmEmail);
router.post('/passwordrecovery', controller.passwordRecovery);
router.post('/resetpassword', validator.resetPasswordRules(), controller.resetPassword);
router.post('/refreshtoken', authRefresh, controller.refreshToken);

module.exports = router;