import {GENRES, ALL_NAMES, COUNTRIES} from './consts.js';
import {getRandomInteger, generateRandomDate, generateTextContent} from '../utils/utils.js';
import {generateAllFilmsComments} from './comments.js';

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
    return Number(`${mainValue}.0`);
  } else {
    return Number(`${mainValue}.${getRandomInteger(0, 9)}`);
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

export const allFilmscomments = generateAllFilmsComments();

export const generateFilm = (index) => {
  const descriptionMaxSentencesNumber = 5;
  const maxAgeLimit = 18;
  const id = index;

  return {
    id,
    comments: allFilmscomments[id].map((comment) => comment.id),
    filmInfo: {
      poster: generatePoster(),
      title: generateTitle(),
      alternativeTitle: generateTitle(),
      totalRating: generateRating(),
      ageRating: getRandomInteger(0, maxAgeLimit),
      director: ALL_NAMES[getRandomInteger(0, ALL_NAMES.length - 1)],
      writers: generateNames(),
      actors: generateNames(),
      release: {
        date: generateRandomDate(),
        releaseCountry: COUNTRIES[getRandomInteger(0, COUNTRIES.length - 1)]
      },
      runtime: generateDuration(),
      genre: generateGenres(),
      description: generateTextContent(descriptionMaxSentencesNumber)
    },
    userDetails: {
      watchlist: Boolean(getRandomInteger(0, 1)),
      alreadyWatched: Boolean(getRandomInteger(0, 1)),
      watchingDate: generateRandomDate(),
      favourite: Boolean(getRandomInteger(0, 1)),
    }
  };
};
