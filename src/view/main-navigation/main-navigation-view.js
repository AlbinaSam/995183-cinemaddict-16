import {createMainNavigationTemplate} from './main-navigation.tpl.js';
import {createElement} from '../../render.js';

export default class MainNavigationView {
  #element = null;
  #filters = null;

  constructor (filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
