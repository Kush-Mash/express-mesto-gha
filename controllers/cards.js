const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('../utils/constants');
const ValidationError = require('../errors/ValidationError');
const UnhandledError = require('../errors/UnhandledError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(HTTP_STATUS_OK).send({ data: cards }))
    .catch(() => {
      throw new UnhandledError('Ошибка сервера');
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(HTTP_STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Переданы некорректные данные при создании карточки');
      } else {
        throw new UnhandledError('Ошибка сервера');
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id } = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий id карточки');
      } else if (card.owner.valueOf() !== _id) {
        throw new ForbiddenError('Отсутствуют права доступа для удаления данной карточки');
      }
      Card.findByIdAndRemove(cardId)
        .then((card) => res.send(card))
        .catch(() => {
          throw new UnhandledError('Ошибка сервера');
        })
        .catch(next);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new ValidationError('Переданы некорректные данные для постановки лайка');
      } else {
        throw new UnhandledError('Ошибка сервера');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным id не найдена');
      } else {
        res.send({ card });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        throw new ValidationError('Переданы некорректные данные для снятии лайка');
      } else {
        throw new UnhandledError('Ошибка сервера');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
