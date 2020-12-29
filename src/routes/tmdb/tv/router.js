const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.index);
router.get('/:id', controller.details);

module.exports = router;