require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { requestLogger } = require('./middlewares/request');
const { errorLogger } = require('./middlewares/error');
const handleErrors = require('./middlewares/handlerErrors');
const routers = require('./routes/index');
const { crashTest } = require('./utils/constants');

const options = {
  origin: [
    'http://localhost:3000',
    'http://movies.iskra273.nomoredomains.sbs',
    'https://movies.iskra273.nomoredomains.sbs',
    'http://api.movies.iskra273.nomoredomains.sbs',
    'https://api.movies.iskra273.nomoredomains.sbs',
    'https://github.com/iskra273',
  ],
  credentials: true,
};

const { PORT = 3000, MONGO_DB = 'mongodb://localhost:27017/moviesdb' } = process.env;
const app = express();

app.use('*', cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_DB);

app.use(requestLogger);

// краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(crashTest);
  }, 0);
});

app.use(helmet());

app.use('/', routers);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT);
