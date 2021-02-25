const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const roleGuard = require('../../middlewares/role-guard');
const validator = require('../../middlewares/validator');

router.get('/:mediaId', authGuard({ bypass: true }), validator.fetchCommentRules(), controller.fetch);

router.use(authGuard());
router.use(roleGuard.regular);
router.post('/', validator.addCommentRules(), controller.add);
router.put('/', validator.updateCommentRules(), controller.update);
router.patch('/', validator.deleteCommentRules(), controller.delete);

module.exports = router;