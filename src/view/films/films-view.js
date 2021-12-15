import AbstractView from '../abstract-view.js';
import {createFilmsTemplate} from './films.tpl.js';

export default class FilmsView extends AbstractView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template () {
    return createFilmsTemplate(this.#films);
  }
}
