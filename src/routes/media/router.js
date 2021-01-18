const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const roleGuard = require('../../middlewares/role-guard');
const validator = require('../../middlewares/validator');

router.get('/details/:id', validator.viewMediaRules(), controller.details);
router.get('/fetch', controller.fetch);
router.get('/search', controller.search);
router.get('/stream', controller.index);

router.use(authGuard);
router.use(roleGuard.admin);
router.post('/movie', validator.addMediaRules(), controller.addMovie);
router.post('/tv', validator.addMediaRules(), controller.addTv);
router.post('/tv/season', validator.addTvSeasonRules(), controller.addTvSeason);
router.post('/tv/episode', validator.addTvEpisodeRules(), controller.addTvEpisode);
router.post('/video', controller.index);
router.post('/credit', controller.index);
router.post('/stream', controller.index);
router.put('/movie', controller.update);
router.put('/tv', controller.update);
router.put('/tv/season', controller.update);
router.put('/tv/episode', controller.update);
router.put('/video', controller.update);
router.put('/credit', controller.update);
router.put('/stream', controller.update);
router.delete('/movie/:id', controller.delete);
router.delete('/tv/:id', controller.delete);
router.delete('/tv/:id/season/:season', controller.delete);
router.delete('/tv/:id/season/:season/episode/:episode', controller.delete);
router.delete('/media/:id/video/:video', controller.delete);
router.delete('/credit/:id', controller.delete);
router.delete('/media/:id/stream/:stream', controller.delete);

module.exports = router;