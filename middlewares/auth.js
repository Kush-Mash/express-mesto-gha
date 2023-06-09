const mongoose = require('mongoose');
const { checkToken } = require('../utils/jwtAuth');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new UnauthorizedError('Пользователь не авторизован');
  }

  const token = req.headers.authorization.replace('Bearer ', '');

  try {
    const payload = checkToken(token);

    req.user = {
      _id: new mongoose.Types.ObjectId(payload._id),
    };
    next();
  } catch (err) {
    throw new UnauthorizedError('Пользователь не авторизован');
  }
};

module.exports = auth;
