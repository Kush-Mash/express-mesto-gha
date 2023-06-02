const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { statusNotFound } = require('../utils/constants');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('*', (req, res) => {
  res.status(statusNotFound).send({
    message: 'Запрашиваемая страница не найдена'
  });
});

module.exports = router;