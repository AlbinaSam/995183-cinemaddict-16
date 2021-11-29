import {createUserProfileTemplate} from './view/user-profile-view.js';
import {createMainNavigationTemplate} from './view/main-navigation-view.js';
import {createSortingTemplate} from './view/sorting-view.js';
import {createFilmsTemplate} from './view/films-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';
import {createPopupTemplate} from './view/popup-view.js';
import {RenderPosition, renderTemplate} from './render.js';

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

renderTemplate(headerElement, createUserProfileTemplate(), RenderPosition.BEFOREEND);

renderTemplate(mainElement, createMainNavigationTemplate(), RenderPosition.AFTERBEGIN);

renderTemplate(mainElement, createSortingTemplate(), RenderPosition.BEFOREEND);

renderTemplate(mainElement, createFilmsTemplate(), RenderPosition.BEFOREEND);


const filmsListContainerElement = mainElement.querySelector('.films-list .films-list__container');
const FILM_CARD_COUNT = 5;
for(let i = 0; i < FILM_CARD_COUNT; i++) {
  renderTemplate(filmsListContainerElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
}

const extraFilmsListContainerElements = mainElement.querySelectorAll('.films-list--extra .films-list__container');
const EXTRA_FILM_CARD_COUNT = 2;
Array.from(extraFilmsListContainerElements).forEach((extraFilmsListContainerElement) => {
  for(let i = 0; i < EXTRA_FILM_CARD_COUNT; i++) {
    renderTemplate(extraFilmsListContainerElement, createFilmCardTemplate(), RenderPosition.BEFOREEND);
  }
});

renderTemplate(filmsListContainerElement, createShowMoreButtonTemplate(), RenderPosition.AFTEREND);

const footerElement = document.querySelector('.footer');
const renderPopupTemplate = () => {
  renderTemplate(footerElement, createPopupTemplate(), RenderPosition.AFTEREND);
  const popup = document.querySelector('.film-details');
  popup.style.display = 'none';
};
renderPopupTemplate();
