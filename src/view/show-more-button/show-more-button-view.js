import {createShowMoreButtonTemplate} from './show-more-button.tpl.js';
import {createElement} from '../../render.js';

export default class ShowMoreButtonView {
  #element = null;

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template () {
    return createShowMoreButtonTemplate();
  }

  removeElement () {
    this.#element = null;
  }
}
