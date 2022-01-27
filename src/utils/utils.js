import {Statuses} from '../consts';

export const isBetween = (x, min, max) => x >= min && x <= max;

export const isEscapePressed = (evt) => evt.key === 'Esc' || evt.key === 'Escape';

export const generateUserStatus = (films) => {
  const filmsNumber = films.filter((film) => film.userDetails.alreadyWatched).length;

  let status ='';
  if (isBetween(filmsNumber, 1, 10)) {
    status = Statuses.NOVICE;
  } else if (isBetween(filmsNumber, 11, 20)) {
    status = Statuses.FAN;
  } else if (filmsNumber >= 21) {
    status = Statuses.MOVIEBUFF;
  }

  return status;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

export const adaptFilmToClient = (film) => {
  const adaptedFilm = { ...film,
    filmInfo: {...film.film_info,
      ageRating: film.film_info.age_rating,
      alternativeTitle: film.film_info.alternative_title,
      totalRating: film.film_info.total_rating,
      release: {...film.film_info.release,
        date: new Date(film.film_info.release.date),
        releaseCountry: film.film_info.release.release_country,
      },
    },
    userDetails: {...film.user_details,
      alreadyWatched: film.user_details.already_watched,
      watchingDate: new Date(film.user_details.watching_date),
    },
  };

  delete adaptedFilm.film_info;
  delete adaptedFilm.filmInfo.age_rating;
  delete adaptedFilm.filmInfo.alternative_title;
  delete adaptedFilm.filmInfo.total_rating;
  delete adaptedFilm.filmInfo.release.release_country;
  delete adaptedFilm.user_details;
  delete adaptedFilm.userDetails.already_watched;
  delete adaptedFilm.userDetails.watching_date;

  return adaptedFilm;
};

export const adaptFilmToServer = (film) => {
  const adaptedFilm = {...film,
    'film_info': {...film.filmInfo,
      'age_rating': film.filmInfo.ageRating,
      'alternative_title': film.filmInfo.alternativeTitle,
      'total_rating': film.filmInfo.totalRating,
      release: {...film.filmInfo.release,
        date: film.filmInfo.release.date.toISOString(),
        'release_country': film.filmInfo.release.releaseCountry,
      },
    },
    'user_details': {...film.userDetails,
      'already_watched': film.userDetails.alreadyWatched,
      'watching_date': film.userDetails.watchingDate.toISOString(),
    },
  };

  delete adaptedFilm.filmInfo;
  delete adaptedFilm.film_info.ageRating;
  delete adaptedFilm.film_info.alternativeTitle;
  delete adaptedFilm.film_info.totalRating;
  delete adaptedFilm.film_info.release.releaseCountry;
  delete adaptedFilm.userDetails;
  delete adaptedFilm.user_details.alreadyWatched;
  delete adaptedFilm.user_details.watchingDate;

  return adaptedFilm;
};
