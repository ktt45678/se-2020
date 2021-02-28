const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const roleGuard = require('../../middlewares/role-guard');
const validator = require('../../middlewares/validator');

router.get('/', controller.index);
router.get('/fetch', authGuard({ bypass: true }), validator.fetchMediaRules(), controller.fetch);
router.get('/latest', authGuard({ bypass: true }), validator.viewLatestMediaRules(), controller.latest);
router.get('/details/:id', authGuard({ bypass: true }), validator.viewMediaRules(), controller.details);
router.get('/details/:id/season/:season', authGuard({ bypass: true }), validator.viewTvSeasonRules(), controller.tvSeasonDetails);
router.get('/details/:id/season/:season/episode/:episode', authGuard({ bypass: true }), validator.viewTvEpisodeRules(), controller.tvEpisodeDetails);
router.get('/stream/:id', authGuard({ bypass: true }), validator.streamRules(), controller.stream);

router.use(authGuard());
router.use(roleGuard.admin);
router.post('/movie', validator.addMovieRules(), controller.addMovie);
router.post('/tv', validator.addTvRules(), controller.addTv);
router.post('/tv/season', validator.addAndUpdateTvSeasonRules(), controller.addTvSeason);
router.post('/tv/episode', validator.addAndUpdateTvEpisodeRules(), controller.addTvEpisode);
router.put('/movie', validator.updateMovieRules(), controller.updateMovie);
router.put('/tv', validator.updateTvRules(), controller.updateTv);
router.put('/tv/season', validator.addAndUpdateTvSeasonRules(), controller.updateTvSeason);
router.put('/tv/episode', validator.addAndUpdateTvEpisodeRules(), controller.updateTvEpisode);
router.patch('/movie', validator.deleteMediaRules(), controller.deleteMovie);
router.patch('/tv', validator.deleteMediaRules(), controller.deleteTv);
router.patch('/tv/season', validator.deleteTvSeasonRules(), controller.deleteTvSeason);
router.patch('/tv/episode', validator.deleteTvEpisodeRules(), controller.deleteTvEpisode);

module.exports = router;