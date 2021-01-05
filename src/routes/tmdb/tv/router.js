const router = require('express').Router();
const controller = require('./controller');

router.get('/', controller.index);
router.get('/:id', controller.details);
router.get('/:id/images', controller.images);
router.get('/:id/videos', controller.videos);
router.get('/:id/credits', controller.credits);
router.get('/:id/season/:season', controller.season);
router.get('/:id/season/:season/episode/:episode', controller.episode);

module.exports = router;