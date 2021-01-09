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
router.post('/add', controller.add);
router.put('/update/:id', controller.update);
router.delete('/delete/:id', controller.delete);

module.exports = router;