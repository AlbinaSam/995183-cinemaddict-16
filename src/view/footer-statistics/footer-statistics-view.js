import AbstractView from '../abstract-view.js';
import {createTotalFilmNumberTemplate} from './footer-statistics.tpl.js';

export default class TotalFilmNumberView extends AbstractView {
  #filmsNumber = null;

  constructor(filmsNumber) {
    super();
    this.#filmsNumber = filmsNumber;
  }

  get template() {
    return createTotalFilmNumberTemplate(this.#filmsNumber);
  }
}
