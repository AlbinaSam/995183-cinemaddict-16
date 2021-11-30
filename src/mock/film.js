import {GENRES, ALL_NAMES} from '../const.js';
import {getRandomInteger, generateRandomDate, generateTextContent} from '../utils.js';
import {generateComments} from './comments.js';

const COUNTRIES= ['Russia', 'USA', 'England', 'India', 'Spain'];

const generatePoster = () => {
  const posters = ['made-for-each-other.png', 'popeye-meets-sinbad.png', 'sagebrush-trail.jpg', 'santa-claus-conquers-the-martians.jpg', 'the-dance-of-life.jpg', 'the-great-flamarion.jpg', 'the-man-with-the-golden-arm.jpg'];
  const randomIndex = getRandomInteger(0, posters.length - 1);
  return `./images/posters/${posters[randomIndex]}`;
};

const generateTitle = () => {
  const titles = ['The Dance of Life', 'Sagebrush Trail', 'The Man with the Golden Arm', 'Santa Claus Conquers the Martians', 'Popeye the Sailor Meets Sindbad the Sailor', 'Titanic', 'Dune'];
  const randomIndex = getRandomInteger(0, titles.length - 1);
  return titles[randomIndex];
};

const generateRating = () =>  {
  const maxRatingNumber = 10;
  const mainValue = getRandomInteger(1, maxRatingNumber);
  if (mainValue === maxRatingNumber) {
    return `${mainValue}.0`;
  } else {
    return `${mainValue}.${getRandomInteger(0, 9)}`;
  }
};

const generateNames = () => {
  const maxNamesNumber = 3;
  const randomNumber = getRandomInteger(1, maxNamesNumber);
  const randomNames = new Set();
  for(let i = 0; i < randomNumber; i++) {
    const randomIndex = getRandomInteger(0, ALL_NAMES.length - 1);
    randomNames.add(ALL_NAMES[randomIndex]);
  }
  return Array.from(randomNames);
};

const generateDuration = () => {
  const minMinutesDuration = 60;
  const maxMinutessDuration = 180;
  return getRandomInteger(minMinutesDuration, maxMinutessDuration);
};

const generateGenres = () => {
  const randomNumber = getRandomInteger(1, GENRES.length - 1);
  const filmGenres = new Set();
  for(let i = 0; i < randomNumber; i++) {
    const randomIndex = getRandomInteger(0, GENRES.length - 1);
    filmGenres.add(GENRES[randomIndex]);
  }
  return Array.from(filmGenres);
};

export const comments = generateComments();

export const generateFilm = () => {
  const descriptionMaxSentencesNumber = 5;
  const maxAgeLimit = 18;

  return {
    comments: comments.map((comment) => comment.id),
    filmInfo: {
      poster: generatePoster(),
      title: generateTitle(),
      originalTitle: generateTitle(),
      rating: generateRating(),
      ageLimit: getRandomInteger(0, maxAgeLimit),
      director: ALL_NAMES[getRandomInteger(0, ALL_NAMES.length - 1)],
      writers: generateNames(),
      actors: generateNames(),
      release: {
        date: generateRandomDate(),
        country: COUNTRIES[getRandomInteger(0, COUNTRIES.length - 1)]
      },
      duration: generateDuration(),
      genres: generateGenres(),
      description: generateTextContent(descriptionMaxSentencesNumber)
    },
    userDetails: {
      isInWatchlist: getRandomInteger(0, 1),
      isWatched: getRandomInteger(0, 1),
      watchingDate: generateRandomDate(),
      isFavourite: getRandomInteger(0, 1)
    }
  };
};
