import AbstarctView from '../abstract-view.js';
import {createMainNavigationTemplate} from './main-navigation.tpl.js';

export default class MainNavigationView extends AbstarctView {
  #filters = null;

  constructor (filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters);
  }
}
