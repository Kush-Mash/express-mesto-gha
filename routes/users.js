const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getUsers);
router.post('/', usersController.createUser);
router.patch('/me', usersController.updateUser);
router.get('/:userId', usersController.getUserById);
router.patch('/me/avatar', usersController.updateUserAvatar);

module.exports = router;