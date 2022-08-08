const routers = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { validateLogin, validateCreateUser } = require('../middlewares/validator');
const { notFoundError } = require('../utils/constants');

routers.post('/signin', validateLogin, login);
routers.post('/signup', validateCreateUser, createUser);

routers.use('/', auth, usersRouter);
routers.use('/', auth, moviesRouter);

routers.use((req, res, next) => {
  next(new NotFoundError(notFoundError));
});

module.exports = routers;
