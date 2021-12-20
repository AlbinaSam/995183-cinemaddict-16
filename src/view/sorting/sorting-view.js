import AbstractView from '../abstract-view.js';
import {createSortingTemplate} from './sorting.tpl.js';

export default class SortingView extends AbstractView {
  #currentSortType = null;


  constructor (currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template () {
    return createSortingTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
