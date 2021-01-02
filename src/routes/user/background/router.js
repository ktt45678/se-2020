const router = require('express').Router({ mergeParams: true });
const controller = require('./controller');
const rateLimiter = require('../../../middlewares/rate-limiter');

router.get('/', controller.view);
router.post('/', rateLimiter(300), controller.upload);
router.delete('/', controller.delete);

module.exports = router;