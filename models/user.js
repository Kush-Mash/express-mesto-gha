const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Обязательное поле'],
    minlength: [2, 'Минимальная длина имени - 2'],
    maxlength: [30, 'Максимальная длина имени - 30'],
  },
  about: {
    type: String,
    required: [true, 'Обязательное поле'],
    minlength: [2, 'Минимальная длина описания - 2'],
    maxlength: [30, 'Максимальная длина описания - 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Обязательное поле'],
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error('Некорректный URL');
      }
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
