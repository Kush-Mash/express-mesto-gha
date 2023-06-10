const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const signToken = require('../utils/jwtAuth').signToken;
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  MONGO_DUPLICATE_KEY_ERROR,
  SALT_ROUNDS,
} = require('../utils/constants');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const UnhandledError = require('../errors/UnhandledError');
const NotFoundError = require('../errors/NotFoundError');

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new Error('badRequestUser');
    })
    .then((user) => {
      return Promise.all([user, bcrypt.compare(password, user.password)]);
    })
    .then(([user, isEqual]) => {
      if (!isEqual) {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      }

      const token = signToken({ _id: user._id });

      res.status(HTTP_STATUS_OK).send({ message: 'авторизован', token });
    })
    .catch((err) => {
      if (err.message === 'badRequestUser') {
        throw new ValidationError('Переданы некорректные данные при создании пользователя');
      }
      throw new UnhandledError('Ошибка сервера');
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send({ users }))
    .catch(() => {
      throw new UnhandledError('Ошибка сервера');
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt.hash(password, SALT_ROUNDS).then((hash) => {
    User.create({ email, password: hash, name, about, avatar })
      .then(() => {
        res.status(HTTP_STATUS_CREATED).send({ email, name, about, avatar });
      })
      .catch((err) => {
        if (err instanceof mongoose.Error.ValidationError) {
          throw new ValidationError('Переданы некорректные данные при создании пользователя');
        } else if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
          throw new ConflictError('Такой пользователь уже существует');
        } else {
          throw new UnhandledError('Ошибка сервера');
        }
      })
      .catch(next);
  });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      } else if (err instanceof mongoose.Error.CastError) {
        throw new ValidationError('Передан некорректный id');
      } else {
        throw new UnhandledError('Ошибка сервера');
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Переданы некорректные данные при обновлении профиля');
      } else {
        throw new UnhandledError('Ошибка сервера');
      }
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден');
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара');
      } else {
        throw new UnhandledError('Ошибка сервера');
      }
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId).then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    res.send(user);
  })
    .catch(next);
};

module.exports = {
  login,
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
};
