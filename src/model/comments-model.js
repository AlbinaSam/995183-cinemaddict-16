import AbstractObservable from '../services/abstract-observable';
import {UpdateType} from '../consts';
import {adaptFilmToClient} from '../utils/utils';

export default class CommentsModel extends AbstractObservable {
  #comments = [];
  #apiService = null;
  #filmsModel = null;

  constructor(apiService, filmsModel) {
    super();
    this.#apiService = apiService;
    this.#filmsModel = filmsModel;
  }

  init = async (film) => {
    try {
      const comments = await this.#apiService.getComments(film.id);
      this.#comments = comments;
    } catch(err) {
      this.#comments = [];
    }

    this._notify(UpdateType.COMMENTS_LOADED, film);
  }

  get comments() {
    return this.#comments;
  }

  addComment = async (updateType, update, filmId) => {

    try {
      const response = await this.#apiService.addComment(update, filmId);
      const {movie, comments} = response;

      this.#comments = comments;

      const filmToUpdate = this.#filmsModel.films.find((item) => item.id === filmId);
      filmToUpdate.comments = movie.comments;

      this._notify(updateType, adaptFilmToClient(movie));
    } catch(err) {
      throw new Error('Can\'t add film');
    }
  }

  deleteComment = async (updateType, update, filmId) => {
    const index = this.#comments.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    try {
      await this.#apiService.deleteComment(update);
      this.#comments = [
        ...this.#comments.slice(0, index),
        ...this.#comments.slice(index + 1)
      ];

      const filmToUpdate = this.#filmsModel.films.find((item) => item.id === filmId);

      const commentIndex = filmToUpdate.comments.findIndex((id) => id === update.id);

      if (commentIndex === -1) {
        throw new Error('Can\'t delete unexisting comment');
      }

      filmToUpdate.comments = [
        ...filmToUpdate.comments.slice(0, commentIndex),
        ...filmToUpdate.comments.slice(commentIndex + 1)
      ];

      this._notify(updateType, filmToUpdate);
    } catch(err) {
      throw new Error('Can\'t delete task');
    }
  }
}
