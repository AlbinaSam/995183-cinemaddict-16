import {createUserProfileTemplate} from './user-profile.tpl.js';
import {createElement} from '../../render.js';

export default class UserProfileView {
  #element = null;
  #status = null;

  constructor(status) {
    this.#status = status;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createUserProfileTemplate(this.#status);
  }

  removeElement() {
    this.#element = null;
  }
}
