const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');

router.use(authGuard);
router.get('/', controller);

module.exports = router;