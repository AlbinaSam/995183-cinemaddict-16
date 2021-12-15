import AbstractView from '../abstract-view.js';
import {createNoFilmsTemplate} from './no-films.tpl.js';

export default class NoFilmsView extends AbstractView {
  #filterName = null;

  constructor (filterName) {
    super();
    this.#filterName = filterName;
  }

  get template () {
    return createNoFilmsTemplate(this.#filterName);
  }
}
