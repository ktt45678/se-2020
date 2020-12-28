const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');

router.get('/', controller.view);
router.post('/', controller.upload);
router.delete('/', controller.delete);

module.exports = router;