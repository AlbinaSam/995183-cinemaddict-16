import AbstractView from '../abstract-view.js';
import {createMainNavigationTemplate} from './main-navigation.tpl.js';

export default class MainNavigationView extends AbstractView {
  #filters = null;

  constructor (filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters);
  }
}
