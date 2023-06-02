const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const {
  statusOK,
  statusCreated,
  statusBadRequest,
  statusNotFound,
  statusInternalServerError
} = require('../utils/constants');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(statusOK).send({ data: cards }))
    .catch((err) => {
      res.status(statusInternalServerError).send({
        message: 'Ошибка сервера',
        err: err.message,
        stack: err.stack
      });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(statusCreated).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(statusBadRequest).send({
          message: 'Переданы некорректные данные при создании карточки',
          err: err.message,
          stack: err.stack
        });
      } else {
        res.status(statusInternalServerError).send({
          message: 'Ошибка сервера',
          err: err.message,
          stack: err.stack
        });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof Error.DocumentNotFoundError) {
        res.status(statusNotFound).send({
          message: 'Карточка с указанным id не найдена',
          err: err.message,
          stack: err.stack
        });
      } else
      if (err instanceof mongoose.Error.CastError) {
        res.status(statusBadRequest).send({
          message: 'Переданы некорректные данные при удалении карточки',
          err: err.message,
          stack: err.stack
        });
      } else {
        res.status(statusInternalServerError).send({
          message: 'Ошибка сервера',
          err: err.message,
          stack: err.stack
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusNotFound).send({
          message: 'Передан несуществующий id карточки'
        });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(statusBadRequest).send({
          message: 'Переданы некорректные данные для постановки лайка',
          err: err.message,
          stack: err.stack
        });
      } else {
        res.status(statusInternalServerError).send({
          message: 'Ошибка сервера',
          err: err.message,
          stack: err.stack
        });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(statusNotFound).send({
          message: 'Передан несуществующий id карточки'
        });
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(statusBadRequest).send({
          message: 'Переданы некорректные данные для снятии лайка',
          err: err.message,
          stack: err.stack
        });
      } else {
        res.status(statusInternalServerError).send({
          message: 'Ошибка сервера',
          err: err.message,
          stack: err.stack
        });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};