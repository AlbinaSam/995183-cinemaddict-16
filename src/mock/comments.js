import {Emotions, ALL_NAMES} from '../const.js';
import {getRandomInteger, generateRandomDate, generateTextContent} from '../utils.js';

const MAX_COMMENTS_NUMBER = 5;

const generateEmoji = () => {
  const randeomIndex = getRandomInteger(0, Object.values(Emotions).length - 1);
  return `./images/emoji/${Object.values(Emotions)[randeomIndex]}.png`;
};

const generateComment = () => {
  const commentMaxSentencesNumber = 1;
  return {
    id: getRandomInteger(1, 10),
    emoji: generateEmoji(),
    date: generateRandomDate(),
    authorName: ALL_NAMES[getRandomInteger(0, ALL_NAMES.length - 1)],
    message: generateTextContent(commentMaxSentencesNumber),
  };
};

export const generateComments = () => Array.from({length: getRandomInteger(0, MAX_COMMENTS_NUMBER)}, generateComment);
