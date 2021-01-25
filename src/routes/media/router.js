const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const roleGuard = require('../../middlewares/role-guard');
const validator = require('../../middlewares/validator');

router.get('/', controller.index);
router.get('/fetch', validator.fetchMediaRules(), controller.fetch);
router.get('/details/:id', validator.viewMediaRules(), controller.details);
router.get('/stream/:id', validator.streamRules(), controller.stream);

router.use(authGuard);
router.use(roleGuard.admin);
router.post('/movie', validator.addMovieRules(), controller.addMovie);
router.post('/tv', validator.addTvRules(), controller.addTv);
router.post('/tv/season', validator.addTvSeasonRules(), controller.addTvSeason);
router.post('/tv/episode', validator.addTvEpisodeRules(), controller.addTvEpisode);
router.put('/movie', validator.updateMovieRules(), controller.updateMovie);
router.put('/tv', validator.updateTvRules(), controller.updateTv);
router.put('/tv/season', validator.updateTvSeasonRules(), controller.updateTvSeason);
router.put('/tv/episode', validator.updateTvEpisodeRules(), controller.updateTvEpisode);
router.patch('/movie', validator.deleteMediaRules(), controller.deleteMovie);
router.patch('/tv', validator.deleteMediaRules(), controller.deleteTv);
router.patch('/tv/season', validator.deleteTvSeasonRules(), controller.deleteTvSeason);
router.patch('/tv/episode', validator.deleteTvEpisodeRules(), controller.deleteTvEpisode);

module.exports = router;