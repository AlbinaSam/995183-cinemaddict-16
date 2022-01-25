import {createElement} from '../utils/render';

const SHAKE_ANIMATION_TIMEOUT = 600;

export default class AbstractView {
  #element = null;
  _callback = {};

  constructor () {
    if (new.target === this) {
      throw new Error('Can\'t instantiate AbstractView, only concrete one.');
    }
  }

  get element () {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  removeElement () {
    this.#element = null;
  }

  shake(callback = null) {
    this.element.classList.add('shake');
    setTimeout(() => {
      this.element.classList.remove('shake');
      if (callback) {
        callback();
      }
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
