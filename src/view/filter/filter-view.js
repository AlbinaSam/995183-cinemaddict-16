import AbstractView from '../abstract-view';
import {createFilterTemplate} from './filter.tpl';

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilterType = null;

  constructor (filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template () {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    if (!evt.target.classList.contains('main-navigation__item')) {
      return;
    }

    this._callback.filterTypeChange(evt.target.getAttribute('href').slice(1));
  }
}
