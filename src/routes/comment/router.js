const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const validator = require('../../middlewares/validator');

router.get('/:mediaId', validator.fetchCommentRules(), controller.fetch);

router.use(authGuard());
router.post('/', validator.addCommentRules(), controller.add);
router.put('/', validator.updateCommentRules(), controller.update);
router.patch('/', validator.deleteCommentRules(), controller.delete);

module.exports = router;