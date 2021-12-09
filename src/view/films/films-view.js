import AbstarctView from '../abstract-view.js';
import {createFilmsTemplate} from './films.tpl.js';

export default class FilmsView extends AbstarctView {
  #films = null;

  constructor(films) {
    super();
    this.#films = films;
  }

  get template () {
    return createFilmsTemplate(this.#films);
  }
}
