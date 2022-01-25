import FilterView from '../view/filter/filter-view';
import {RenderPosition, render, replace, remove} from '../utils/render';
import {filter} from '../utils/filter';
import {FilterType, UpdateType} from '../consts';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;
  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#init();

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        id: FilterType.ALL,
        name: 'All movies',
        number: filter[FilterType.ALL](films).length
      },
      {
        id: FilterType.WATCHLIST,
        name: 'Watchlist ',
        number: filter[FilterType.WATCHLIST](films).length
      },
      {
        id: FilterType.HISTORY,
        name: 'History ',
        number: filter[FilterType.HISTORY](films).length
      },
      {
        id: FilterType.FAVORITES,
        name: 'Favorites ',
        number: filter[FilterType.FAVORITES](films).length
      }
    ];
  }

  #init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;


    this.#filterComponent = new FilterView(filters, this.#filterModel.filter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.#init();
  }

  #handleFilterTypeChange = (filterType) => {

    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  }
}
