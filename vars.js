const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, './.env'),
  sample: path.join(__dirname, './.env.example'),
});

module.exports = {
  yandexKey: process.env.YANDEX_KEY,
  norgivUrl: 'http://norvig.com/big.txt',
};
