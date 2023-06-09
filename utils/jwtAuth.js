const jwt = require('jsonwebtoken');

const SECRET_KEY = 'key_key_key';

const checkToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

const signToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY)
  // console.log(token);
};

module.exports = {
  checkToken,
  signToken,
};
