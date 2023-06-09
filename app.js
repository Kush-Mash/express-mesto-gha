const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    app.listen(3000);
  })
  .catch(() => {
    process.exit();
  });

app.use(express.json());
app.use(router);
app.use(errors());
app.use(errorHandler);
