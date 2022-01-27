import AbstractObservable from '../services/abstract-observable';
import {UpdateType} from '../consts';
import {adaptFilmToClient} from '../utils/utils';

export default class FilmsModel extends AbstractObservable {
  #films = [];
  #apiService = null;

  constructor(apiService) {
    super();
    this.#apiService = apiService ;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(adaptFilmToClient);
    } catch(err) {
      this.#films = [];
    }

    this._notify(UpdateType.INIT);
  }

  get films() {
    return this.#films;
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((item) => item.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);

      const updatedFilm = adaptFilmToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];

      this._notify(updateType, updatedFilm);

    } catch(err) {
      throw new Error('Can\'t update film');
    }
  }
}
