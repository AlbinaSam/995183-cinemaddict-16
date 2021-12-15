import AbstractView from '../abstract-view.js';
import {createPopupTemplate} from './popup.tpl.js';

export default class PopupView extends AbstractView {
  #film = null;
  #comments = null;

  constructor (film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createPopupTemplate(this.#film, this.#comments);
  }

  setAddToWatchClickHandler = (callback) => {
    this._callback.addToWatchPopup = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#addtoWatchListClickHandler);
  }

  #addtoWatchListClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToWatchPopup();
  }

  setAlreadyWatchedClickHandler = (callback) => {
    this._callback.alreadyWatchedPopup = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#alreadyWatchedClickHandler);
  }

  #alreadyWatchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.alreadyWatchedPopup();
  }

  setAddToFavoriteClickHandler = (callback) => {
    this._callback.addToFavoritePopup = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#addToFavoriteClickHandler);
  }

  #addToFavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.addToFavoritePopup();
  }
}
