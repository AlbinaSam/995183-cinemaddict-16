import {createSortingTemplate} from './sorting.tpl.js';
import {createElement} from '../../render.js';

export default class SortingView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template () {
    return createSortingTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}
