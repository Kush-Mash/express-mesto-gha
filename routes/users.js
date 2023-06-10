const router = require('express').Router();
const usersController = require('../controllers/users');
const usersValidate = require('../middlewares/validate');

router.get('/', usersController.getUsers);
router.post('/', usersValidate.validateUserCreate, usersController.createUser);
router.patch('/me', usersValidate.validateUpdateUser, usersController.updateUser);
router.patch('/me/avatar', usersValidate.validateAvatar, usersController.updateUserAvatar);
router.get('/me', usersController.getCurrentUser);
router.get('/:userId', usersValidate.validateUserId, usersController.getUserById);

module.exports = router;
