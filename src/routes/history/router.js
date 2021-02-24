const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const validator = require('../../middlewares/validator');

router.use(authGuard());
router.get('/', validator.fetchHistoryRules(), controller.fetch);
router.get('/:mediaId', validator.getHistoryRules(), controller.get);
router.post('/', validator.addHistoryRules(), controller.add);

module.exports = router;