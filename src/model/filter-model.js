import AbstractObservable from '../utils/abstract-observable';
import {FilterType} from '../consts';

export default class FilterModel extends AbstractObservable {
  #currentFilter = FilterType.ALL;

  get filter() {
    return this.#currentFilter;
  }

  setFilter = (updateType, filter) => {
    this.#currentFilter = filter;
    this._notify(updateType, filter);
  }
}
