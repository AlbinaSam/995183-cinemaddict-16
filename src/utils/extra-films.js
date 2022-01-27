import {sortByRating, sortByCommentsAmount} from '../utils/sorting';
import {FilmAmounts} from '../consts';

export const getTopRatedFilms = (films) => films.sort(sortByRating)
  .slice(0, FilmAmounts.EXTRA_FILM_AMOUNT)
  .filter((film) => film.filmInfo.totalRating !== 0);

export const getMostCommentedFilms = (films) => films.sort(sortByCommentsAmount)
  .slice(0, FilmAmounts.EXTRA_FILM_AMOUNT)
  .filter((film) => film.comments.length !== 0);
