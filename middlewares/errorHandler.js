const HTTP_STATUS_INTERNAL_SERVER_ERROR = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  const { statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR, message = 'Ошибка сервера' } = err;
  console.log('Дефолтный обработчик ошибок:', err);
  res.status(statusCode)
    .send({ message });

  next();
};

module.exports = errorHandler;
