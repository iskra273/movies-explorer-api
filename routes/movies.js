const moviesRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

const {
  validateMovie,
  validateMovieId,
} = require('../middlewares/validator');

moviesRouter.get('/movies', getMovies);
moviesRouter.post('/movies', validateMovie, createMovie);
moviesRouter.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = moviesRouter;
