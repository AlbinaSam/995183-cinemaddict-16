import {createPopupTemplate} from './popup.tpl.js';
import {createElement} from '../../render.js';

export default class PopupView {
  #element = null;
  #film = null;
  #comments = null;

  constructor (film, comments) {
    this.#film = film;
    this.#comments = comments;
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createPopupTemplate(this.#film, this.#comments);
  }

  removeElement() {
    this.#element = null;
  }
}
