import {createUserProfileTemplate} from './view/user-profile-view.js';
import {createMainNavigationTemplate} from './view/main-navigation-view.js';
import {createSortingTemplate} from './view/sorting-view.js';
import {createFilmsTemplate} from './view/films-view.js';
import {createFilmCardTemplate} from './view/film-card-view.js';
import {createShowMoreButtonTemplate} from './view/show-more-button-view.js';
import {createTotalFilmNumberTemplate} from './view/footer-statistics-view.js';
import {createPopupTemplate} from './view/popup-view.js';
import {RenderPosition, renderTemplate} from './render.js';
import {generateUserStatus} from './mock/user-profile.js';
import {generateFilm, comments} from './mock/film.js';
import {generateFilter} from './mock/filter.js';

const FILM_COUNT = 26;
const FILM_COUNT_PER_STEP = 5;

const films = Array.from({length: FILM_COUNT}, generateFilm);

const filters = generateFilter(films);
const userProfileStatus = generateUserStatus(films);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');

renderTemplate(headerElement, createUserProfileTemplate(userProfileStatus), RenderPosition.BEFOREEND);

renderTemplate(mainElement, createMainNavigationTemplate(filters), RenderPosition.AFTERBEGIN);

renderTemplate(mainElement, createSortingTemplate(), RenderPosition.BEFOREEND);

renderTemplate(mainElement, createFilmsTemplate(), RenderPosition.BEFOREEND);


const filmsListContainerElement = mainElement.querySelector('.films-list .films-list__container');

for(let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderTemplate(filmsListContainerElement, createFilmCardTemplate(films[i], comments), RenderPosition.BEFOREEND);
}

const extraFilmsListContainerElements = mainElement.querySelectorAll('.films-list--extra .films-list__container');
const EXTRA_FILM_COUNT = 2;
Array.from(extraFilmsListContainerElements).forEach((extraFilmsListContainerElement) => {
  for(let i = 0; i < EXTRA_FILM_COUNT; i++) {
    renderTemplate(extraFilmsListContainerElement, createFilmCardTemplate(films[i], comments), RenderPosition.BEFOREEND);
  }
});

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  renderTemplate(filmsListContainerElement, createShowMoreButtonTemplate(), RenderPosition.AFTEREND);

  const showMoreButton = document.querySelector('.films-list__show-more');
  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(filmsListContainerElement, createFilmCardTemplate(film, comments), RenderPosition.BEFOREEND));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

const footerElement = document.querySelector('.footer');
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

renderTemplate(footerStatisticsElement, createTotalFilmNumberTemplate(films.length), RenderPosition.AFTERBEGIN);

const renderPopupTemplate = (currentFilm) => {
  renderTemplate(footerElement, createPopupTemplate(currentFilm, comments), RenderPosition.AFTEREND);
  const popup = document.querySelector('.film-details');
  popup.style.display = 'none';
};

renderPopupTemplate(films[0], comments);
