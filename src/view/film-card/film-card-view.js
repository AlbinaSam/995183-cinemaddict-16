import AbstarctView from '../abstract-view.js';
import {createFilmCardTemplate} from './film-card.tpl.js';

export default class FilmCardView extends AbstarctView {
  #film = null;
  #comments = null;

  constructor(film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createFilmCardTemplate(this.#film, this.#comments);
  }

  setFilmCardClickHandler = (callback) => {
    this._callback.openPopup = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#filmCardClickHandler);
  }

  #filmCardClickHandler = () => {
    this._callback.openPopup();
  }
}
