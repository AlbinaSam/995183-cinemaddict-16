import {createNoFilmsTemplate} from './no-films.tpl.js';
import {createElement} from '../../render.js';

export default class NoFilmsView {
  #element = null;
  #filterName = null;

  constructor (filterName) {
    this.#filterName = filterName;
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template () {
    return createNoFilmsTemplate(this.#filterName);
  }

  removeElement() {
    this.#element = null;
  }
}
