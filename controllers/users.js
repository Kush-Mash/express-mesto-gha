const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send({ data: users }))
    .catch(() => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка сервера',
      });
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.status(HTTP_STATUS_CREATED).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }

      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
        message: 'Ошибка сервера',
      });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь с указанным id не найден',
        });
      } else if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Передан некорректный id',
        });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Ошибка сервера',
        });
      }
    });
};

// const updateUser = (req, res) => {
//   const { name, about } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
//     .orFail()
//     .then((user) => res.send({ user }))
//     .catch((err) => {
//       if (err instanceof mongoose.Error.DocumentNotFoundError) {
//         res.status(HTTP_STATUS_NOT_FOUND).send({
//           message: 'Пользователь с указанным id не найден',
//         });
//       } else if (err instanceof mongoose.Error.CastError) {
//         res.status(HTTP_STATUS_BAD_REQUEST).send({
//           message: 'Передан некорректный id',
//         });
//       } else {
//         res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
//           message: 'Ошибка сервера',
//         });
//       }
//     });
// };

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь с указанным id не найден',
        });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Передан некорректный id',
        });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Ошибка сервера',
        });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        res.status(HTTP_STATUS_NOT_FOUND).send({
          message: 'Пользователь с указанным id не найден',
        });
      } else {
        res.send({ user });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Передан некорректный id',
        });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({
          message: 'Ошибка сервера',
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
