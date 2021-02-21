const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const validator = require('../../middlewares/validator');

router.use(authGuard());
router.get('/', validator.fetchWatchlistRules(), controller.fetch);
router.get('/:mediaId', validator.checkWatchlistRules(), controller.check);
router.post('/', validator.addToWatchlistRules(), controller.add);
router.delete('/:id', validator.deleteFromWatchlistRules(), controller.delete);

module.exports = router;