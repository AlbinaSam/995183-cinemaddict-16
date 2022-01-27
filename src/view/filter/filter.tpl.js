import {FilterType} from '../../consts';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {id, name, number} = filter;
  return `<a href="#${id}" class="main-navigation__item ${id === currentFilterType ? 'main-navigation__item--active' : ''}">${name}${id !== FilterType.ALL ? `<span class="main-navigation__item-count">${number}</span>` : ''}
  </a>`;
};

export const createFilterTemplate = (filters, currentFilterType) => {

  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilterType)).join('');

  return `<div class="main-navigation__items">
    ${filterItemsTemplate}
  </div>`;
};
