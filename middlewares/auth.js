const mongoose = require('mongoose');
const { checkToken } = require('../utils/jwtAuth');
const HTTP_STATUS_UNAUTHORIZED = require('../utils/constants');

// 401 ошибку обработать HTTP_STATUS_UNAUTHORIZED
const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const payload = checkToken(token);

    req.user = {
      _id: new mongoose.Types.ObjectId(payload._id),
    };
    next();
  } catch (err) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
  }
};

module.exports = auth;
