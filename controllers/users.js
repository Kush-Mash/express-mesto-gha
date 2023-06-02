const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const {
  statusOK,
  statusCreated,
  statusBadRequest,
  statusNotFound,
  statusInternalServerError,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(statusOK).send({data: users}))
    .catch((err) => {
      console.log(err);
      res.status(statusInternalServerError).send({
        message: 'Ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(statusCreated).send({data: user});
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(statusBadRequest).send({
          message: 'Переданы некорректные данные при создании пользователя',
          err: err.message,
          stack: err.stack,
        });
        return;
      }

      res.status(statusInternalServerError).send({
        message: 'Ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((users) => res.send(users))
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.MissingSchemaError) {
        res.status(statusNotFound).send({
          message: 'Пользователь по указанному id не найден',
          err: err.message,
          stack: err.stack,
        });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(statusBadRequest).send({
          message: 'Переданы некорректные данные',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(statusInternalServerError).send({
          message: 'Ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(statusBadRequest).send({
          message: 'Переданы некорректные данные при обновлении профиля',
          err: err.message,
          stack: err.stack,
        });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(statusNotFound).send({
          message: 'Пользователь по указанному id не найден',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(statusInternalServerError).send({
          message: 'Ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (!user) {
        res.status(statusNotFound).send({
          message: 'Пользователь по указанному id не найден',
        });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(statusBadRequest).send({
          message: 'Переданы некорректные данные при обновлении аватара',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(statusInternalServerError).send({
          message: 'Ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  updateUserAvatar,
};
