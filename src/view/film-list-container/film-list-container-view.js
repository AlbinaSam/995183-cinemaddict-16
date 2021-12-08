import {createFilmsListContainerTemplate} from './film-list-container.tpl.js';
import {createElement} from '../../render.js';

export default class FilmsListContainerView {
  #element= null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createFilmsListContainerTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
