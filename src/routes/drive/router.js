const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const roleGuard = require('../../middlewares/role-guard');

router.use(authGuard);
router.use(roleGuard.admin);
router.get('/*?', controller.get);

module.exports = router;