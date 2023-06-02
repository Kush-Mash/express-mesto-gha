const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '6477671da8a65a9825b68633' // _id созданного пользователя
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    app.listen(3000, () => {
      console.log('слушаем запросы на 3000 порту');
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });

app.use(express.json());
app.use(router);
