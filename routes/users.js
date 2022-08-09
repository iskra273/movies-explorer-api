const usersRouter = require('express').Router();

const {
  getUserMe,
  updateProfile,
} = require('../controllers/users');

const {
  validateUser,
} = require('../middlewares/validator');

usersRouter.get('/users/me', getUserMe);
usersRouter.patch('/users/me', validateUser, updateProfile);

module.exports = usersRouter;
