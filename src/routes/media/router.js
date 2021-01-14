const router = require('express').Router();
const controller = require('./controller');
const authGuard = require('../../middlewares/auth-guard');
const roleGuard = require('../../middlewares/role-guard');

router.get('/view/:id', controller.view);
router.get('/list', controller.list);
router.get('/search', controller.search);
router.get('/stream', controller.search);

router.use(authGuard);
router.use(roleGuard.admin);
router.post('/movie', controller.addMovie);
router.post('/tv', controller.addTv);
router.post('/tv/season', controller.addTvSeason);
router.post('/tv/episode', controller.addTvEpisode);
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