const Movie = require('../models/movie');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const { dataError, movieNotFoundError, deleteMovieError } = require('../utils/constants');

// возвращает все карточки
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

// создает карточку
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const id = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(dataError));
      } else {
        next(err);
      }
    });
};

// удаляет карточку по идентификатору
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieNotFoundError);
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(deleteMovieError);
      }
      Movie.findByIdAndRemove(movieId)
        .then(() => res.status(200).send(movie))
        .catch(next);
    })
    .catch(next);
};
