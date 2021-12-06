import {createElement} from '../render.js';

const createTotalFilmNumberTemplate = (filmsNumber) => (
  `<p>${filmsNumber} movies inside</p>`
);

export default class TotalFilmNumberView {
  #element = null;
  #filmsNumber = null;

  constructor(filmsNumber) {
    this.#filmsNumber = filmsNumber;
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createTotalFilmNumberTemplate(this.#filmsNumber);
  }

  removeElement() {
    this.#element = null;
  }
}
