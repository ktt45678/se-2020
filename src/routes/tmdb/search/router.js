const router = require('express').Router();
const controller = require('./controller');
const validator = require('../../../middlewares/validator');

router.get('/', controller.index);
router.get('/:type', validator.tmdbSearchRules(), controller.search);

module.exports = router;