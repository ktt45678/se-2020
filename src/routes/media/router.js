const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const roleGuard = require('../../middlewares/role-guard');
const validator = require('../../middlewares/validator');

router.get('/', controller.index);
router.get('/details/:id', validator.viewMediaRules(), controller.details);
router.get('/fetch', controller.fetch);
router.get('/search', controller.search);
router.get('/stream', controller.index);

router.use(authGuard);
router.use(roleGuard.admin);
router.post('/movie', validator.addMovieRules(), controller.addMovie);
router.post('/tv', validator.addTvRules(), controller.addTv);
router.post('/tv/season', validator.addTvSeasonRules(), controller.addTvSeason);
router.post('/tv/episode', validator.addTvEpisodeRules(), controller.addTvEpisode);
router.put('/movie', controller.update);
router.put('/tv', controller.update);
router.put('/tv/season', controller.update);
router.put('/tv/episode', controller.update);
router.delete('/movie/:id', controller.delete);
router.delete('/tv/:id', controller.delete);
router.delete('/tv/:id/season/:season', controller.delete);
router.delete('/tv/:id/season/:season/episode/:episode', controller.delete);

module.exports = router;