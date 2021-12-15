import dayjs from 'dayjs';
import {Statuses} from '../consts';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const generateRandomDate = () => {
  const maxDaysGap = 2000;
  const daysGap = getRandomInteger(-maxDaysGap, 0);
  return dayjs().add(daysGap, 'day').toDate();
};

export const generateTextContent = (maxSentencesNumber) => {
  let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

  text = text.slice(0, -1).split('. ');
  const textContent = [];
  const randomSentencesNumber = getRandomInteger(1, maxSentencesNumber);
  for(let i = 0; i < randomSentencesNumber; i++) {
    textContent.push(text[getRandomInteger(0, text.length - 1)]);
  }
  return `${textContent.join('. ')}.`;
};

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
