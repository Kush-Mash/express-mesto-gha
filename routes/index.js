const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { HTTP_STATUS_NOT_FOUND } = require('../utils/constants');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({
    message: 'Запрашиваемая страница не найдена',
  });
});

module.exports = router;
