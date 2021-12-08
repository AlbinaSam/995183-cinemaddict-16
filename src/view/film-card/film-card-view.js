import {createFilmCardTemplate} from './film-card.tpl.js';
import {createElement} from '../../render.js';

export default class FilmCardView {
  #element = null;
  #film = null;
  #comments = null;

  constructor(film, comments) {
    this.#film = film;
    this.#comments = comments;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createFilmCardTemplate(this.#film, this.#comments);
  }

  removeElement() {
    this.#element = null;
  }
}
