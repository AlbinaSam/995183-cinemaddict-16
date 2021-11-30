import {isBetween} from '../utils.js';

export const generateUserStatus = (films) => {
  const filmsNumber = films.filter((film) => film.userDetails.isWatched).length;

  let status ='';
  if (isBetween(filmsNumber, 1, 10)) {
    status = 'Novice';
  } else if (isBetween(filmsNumber, 11, 20)) {
    status = 'Fan';
  } else if (filmsNumber >= 21) {
    status = 'Movie Buff';
  }

  return status;
};

