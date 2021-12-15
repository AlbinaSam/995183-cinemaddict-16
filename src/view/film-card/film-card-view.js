import AbstractView from '../abstract-view.js';
import {createFilmCardTemplate} from './film-card.tpl.js';

export default class FilmCardView extends AbstractView {
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

  setAddToWatchClickHandler = (callback) => {
    this._callback.addToWatch = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#addtoWatchListClickHandler);
  }

  #addtoWatchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToWatch();
  }

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatched = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  }

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatched();
  }

  setAddToFavoriteClickHandler = (callback) => {
    this._callback.addToFavorite = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#addToFavoriteClickHandler);
  }

  #addToFavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToFavorite();
  }
}
