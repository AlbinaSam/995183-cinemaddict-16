import SmartView from '../smart-view.js';
import {createPopupTemplate} from './popup.tpl.js';

export default class PopupView extends SmartView {
  #comments = null;

  constructor (film, comments) {
    super();
    this._data = PopupView.parseFilmToData(film);
    this.#comments = comments;

    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._data, this.#comments);
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

  setCloseButtonClickHandler = (callback) => {
    this._callback.closePopup = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closeButtonClickHandler);
  }

  #closeButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closePopup();
  }

  #emojiClickHandler = (evt) => {
    this.updateData({newCommentEmoji: evt.target.value, scrollPosition: this.element.scrollTop});
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({newCommentText: evt.target.value}, true);
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('change', this.#emojiClickHandler);
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setAddToWatchClickHandler(this._callback.addToWatchPopup);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedPopup);
    this.setAddToFavoriteClickHandler(this._callback.addToFavoritePopup);
    this.setCloseButtonClickHandler(this._callback.closePopup);
  }

  static parseFilmToData = (film) => ({
    ...film,
    newCommentEmoji: '',
    newCommentText: '',
    scrollPosition: '',
  });

  static parseDataToFilm = (data) => {
    const film = {...data};
    delete film.newCommentEmoji;
    delete film.newCommentText;
    delete film.scrollPosition;

    return film;
  }
}
