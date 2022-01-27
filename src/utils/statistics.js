import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
import {PeriodsNames} from '../consts';

export const createGenresMap = (films) => {
  const allGenres = films.reduce((genres, film) => genres.concat(film.filmInfo.genre), []);
  const uniqGenres = [...new Set(allGenres)];
  const countGenres = (genre) => allGenres.filter((currentGenre) => currentGenre === genre).length;

  return uniqGenres.reduce((acc, genre) => {
    acc[genre] = countGenres(genre);
    return acc;
  }, {});
};

export const findTopGenre = (genresMap) => Object.keys(genresMap).filter((key) => genresMap[key] === Math.max(...Object.values(genresMap)));

export const statPeriods = {
  [PeriodsNames.ALL_TIME]: (films) => (films),
  [PeriodsNames.TODAY]: (films) => films.filter((film) => dayjs().isSame(dayjs(film.userDetails.watchingDate), 'day')),
  [PeriodsNames.WEEK]: (films) => films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(dayjs(), dayjs().subtract(1, 'week'), 'day', '[]')),
  [PeriodsNames.MONTH]: (films) => films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(dayjs(), dayjs().subtract(1, 'month'), 'day', '[]')),
  [PeriodsNames.YEAR]: (films) => films.filter((film) => dayjs(film.userDetails.watchingDate).isBetween(dayjs(), dayjs().subtract(1, 'year'), 'day', '[]')),
};
