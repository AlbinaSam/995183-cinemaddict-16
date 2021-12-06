import {createElement} from '../render.js';

const createFilterItemTemplate = (filter, isActive) => {
  const {id, name, number} = filter;
  return `<a href="#${id}" class="main-navigation__item ${isActive ? 'main-navigation__item--active' : ''}">${name}${number !== 0 ? `<span class="main-navigation__item-count">${number}</span>` : ''}
  </a>`;
};

const createMainNavigationTemplate = (filters) => {

  const filterItemsTemplate = filters.map((filter, index) => createFilterItemTemplate(filter, index === 0)
  ).join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};


export default class MainNavigationView {
  #element = null;
  #filters = null;

  constructor (filters) {
    this.#filters = filters;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createMainNavigationTemplate(this.#filters);
  }

  removeElement() {
    this.#element = null;
  }
}
