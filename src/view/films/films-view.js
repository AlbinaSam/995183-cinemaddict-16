import {createFilmsTemplate} from './films.tpl.js';
import {createElement} from '../../render.js';

export default class FilmsView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createFilmsTemplate(this.#films);
  }

  removeElement () {
    this.#element = null;
  }
}
