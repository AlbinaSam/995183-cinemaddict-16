import UserProfileView from './view/user-profile-view.js';
import MainNavigationView from './view/main-navigation-view.js';
import SortingView from './view/sorting-view.js';
import FilmsContainerView from './view/films-view.js';
import FilmCardView from './view/film-card-view.js';
import ShowMoreButtonView from './view/show-more-button-view.js';
import TotalFilmNumberView from './view/footer-statistics-view.js';
import PopupView from './view/popup-view.js';
import {RenderPosition, render} from './render.js';
import {generateUserStatus} from './mock/user-profile.js';
import {generateFilm, allFilmscomments} from './mock/film.js';
import {generateFilter} from './mock/filter.js';
import {EXTRA_FILM_COUNT, FILM_COUNT, FILM_COUNT_PER_STEP} from './consts.js';

const films = [];
for (let i = 0; i < FILM_COUNT; i++) {
  films.push(generateFilm(i));
}

const filters = generateFilter(films);
const userProfileStatus = generateUserStatus(films);

const body = document.querySelector('body');
const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new UserProfileView(userProfileStatus).element, RenderPosition.BEFOREEND);

render(mainElement, new MainNavigationView(filters).element, RenderPosition.AFTERBEGIN);

render(mainElement, new SortingView().element, RenderPosition.BEFOREEND);

render(mainElement, new FilmsContainerView().element, RenderPosition.BEFOREEND);


const renderFilmCard = (container, film, comments) => {
  const filmCardComponent = new FilmCardView(film, comments);

  const closePopup = (popupComponent) => {
    popupComponent.element.remove();
    popupComponent.removeElement();
    body.classList.remove('hide-overflow');
  };

  const openPopup = () => {
    const popupComponent = new PopupView(film, comments);
    render(footerElement, popupComponent.element, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Esc' || evt.key === 'Escape') {
        evt.preventDefault();
        closePopup(popupComponent);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    document.addEventListener('keydown', onEscKeyDown);

    const closeButton = popupComponent.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', () => {
      closePopup(popupComponent);
      document.removeEventListener('keydown', onEscKeyDown);
    });
  };

  filmCardComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    openPopup();
  });

  render(container, filmCardComponent.element, RenderPosition.BEFOREEND);
};


const filmsListContainerElement = mainElement.querySelector('.films-list .films-list__container');

for(let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  renderFilmCard(filmsListContainerElement, films[i], allFilmscomments[films[i].id]);
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  render(filmsListContainerElement, showMoreButtonComponent.element, RenderPosition.AFTEREND);

  showMoreButtonComponent.element.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => renderFilmCard(filmsListContainerElement, film, allFilmscomments[film.id]));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButtonComponent.element.remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

const extraFilmsListContainerElements = mainElement.querySelectorAll('.films-list--extra .films-list__container');

Array.from(extraFilmsListContainerElements).forEach((extraFilmsListContainerElement) => {
  for(let i = 0; i < EXTRA_FILM_COUNT; i++) {
    renderFilmCard(extraFilmsListContainerElement, films[i], allFilmscomments[films[i].id]);
  }
});

const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

render(footerStatisticsElement, new TotalFilmNumberView(films.length).element, RenderPosition.AFTERBEGIN);
