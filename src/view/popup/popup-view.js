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

  updateComments = (updatedComments) => {
    this.#comments = updatedComments;
  }

  setCommentSubmitHandler = (callback) => {
    this._callback.submitComment = callback;
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', this.#submitHandler);
  }

  #submitHandler = (evt) => {
    if (evt.key === 'Enter' && (evt.ctrlKey || evt.metaKey)) {
      evt.preventDefault();

      this._callback.submitComment(this._data.localComment);
    }
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteComment = callback;
    this.element.querySelector('.film-details__comments-list').addEventListener('click', this.#deleteClickHandler);
  }

  #deleteClickHandler = (evt) => {

    if (!evt.target.classList.contains('film-details__comment-delete')) {
      return;
    }

    evt.preventDefault();
    this._callback.deleteComment(evt.target.closest('.film-details__comment').dataset.commentId);
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
    this.updateData({localComment: {...this._data.localComment, emotion: evt.target.value}, scrollPosition: this.element.scrollTop});
  }

  #commentInputHandler = (evt) => {
    evt.preventDefault();
    this.updateData({localComment: {...this._data.localComment, comment: evt.target.value}}, true);
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
    this.setDeleteClickHandler(this._callback.deleteComment);
    this.setCommentSubmitHandler(this._callback.submitComment);
  }

  static parseFilmToData = (film) => ({
    ...film,
    localComment: {
      comment: '',
      emotion: '',
    },
    scrollPosition: '',
    isSaving: false,
    isDeleting: false,
    deletingCommentId: ''
  });

  // static parseDataToFilm = (data) => {
  //   const film = {...data};
  //   delete film.localComment;
  //   delete film.scrollPosition;
  //   delete film.isSaving;
  //   delete film.isDeleting;
  //   delete film.deletingCommentId;

  //   return film;
  // }
}
