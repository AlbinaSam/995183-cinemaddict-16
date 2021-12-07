import {NoFilmsViewTextContents} from '../../consts.js';

export const createNoFilmsTemplate = (filterName) => (
  `<h2 class="films-list__title">${NoFilmsViewTextContents[filterName]}
  </h2>`
);
