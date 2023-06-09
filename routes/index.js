const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { HTTP_STATUS_NOT_FOUND } = require('../utils/constants');
const usersController = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserBody } = require('../middlewares/validate');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', validateUserBody, usersController.createUser);
router.post('/signin', usersController.login);

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('*', (req, res) => {
  throw new NotFoundError('Запрашиваемая страница не найдена');
});

module.exports = router;
