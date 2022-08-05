require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const cors = require('cors');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { validateLogin, validateCreateUser } = require('./middlewares/validator');
const { requestLogger } = require('./middlewares/request');
const { errorLogger } = require('./middlewares/error');
const { notFoundError, serverError, crashTest } = require('./utils/constants');

const options = {
  origin: [
    'http://localhost:3000',
    'http://movies.iskra273.nomoredomains.sbs',
    'https://mesto.iskra273.nomoredomains.xyz',
    'http://api.movies.iskra273.nomoredomains.sbs',
    'https://api.mesto.iskra273.nomoredomains.xyz',
    'https://github.com/iskra273',
  ],
  credentials: true,
};

const { PORT = 3000, MONGO_DB = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();

app.use('*', cors(options));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGO_DB);

// подключаем логгер запросов
app.use(requestLogger);

// краш-тест сервера
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(crashTest);
  }, 0);
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);
app.use('/', auth, usersRouter);
app.use('/', auth, moviesRouter);

// подключаем логгер ошибок
app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError(notFoundError));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? serverError
        : message,
    });
});

app.listen(PORT);
