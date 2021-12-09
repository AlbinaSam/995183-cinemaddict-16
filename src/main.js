import UserProfileView from './view/user-profile/user-profile-view';
import MainNavigationView from './view/main-navigation/main-navigation-view';
import SortingView from './view/sorting/sorting-view';
import FilmsView from './view/films/films-view';
import FilmsListContainerView from './view/film-list-container/film-list-container-view';
import NoFilmsView from './view/no-films/no-films-view';
import FilmCardView from './view/film-card/film-card-view';
import ShowMoreButtonView from './view/show-more-button/show-more-button-view';
import TotalFilmNumberView from './view/footer-statistics/footer-statistics-view';
import PopupView from './view/popup/popup-view';
import {RenderPosition, render, remove} from './utils/render';
import {generateUserStatus} from './mock/user-profile';
import {generateFilm, allFilmscomments} from './mock/film';
import {generateFilter} from './mock/filter';
import {EXTRA_FILM_COUNT, FILM_COUNT, FILM_COUNT_PER_STEP, DEFAULT_FILTER_NAME} from './consts';
import {isEscapePressed} from './utils/utils';

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

const renderFilmCard = (container, film, comments) => {
  const filmCardComponent = new FilmCardView(film, comments);

  const closePopup = (popupComponent) => {
    remove(popupComponent);
    body.classList.remove('hide-overflow');
  };

  const openPopup = () => {
    const popupComponent = new PopupView(film, comments);
    render(footerElement, popupComponent, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');

    const onEscKeyDown = (evt) => {
      if (isEscapePressed (evt)) {
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

  filmCardComponent.setFilmCardClickHandler(openPopup);

  render(container, filmCardComponent, RenderPosition.BEFOREEND);
};

const mainNavigationComponent = new MainNavigationView(filters);
render(mainElement, mainNavigationComponent, RenderPosition.AFTERBEGIN);

const renederFilms = () => {
  const filmsComponent = new FilmsView(films);
  render(mainNavigationComponent, filmsComponent, RenderPosition.AFTEREND);

  const filmsList = filmsComponent.element.querySelector('.films-list');

  if (films.length === 0) {
    render(filmsList, new NoFilmsView(DEFAULT_FILTER_NAME), RenderPosition.AFTERBEGIN);
  } else {

    render(headerElement, new UserProfileView(userProfileStatus), RenderPosition.BEFOREEND);

    render(mainNavigationComponent, new SortingView(), RenderPosition.AFTEREND);

    const filmsListContainerComponent = new FilmsListContainerView();
    render(filmsList, filmsListContainerComponent, RenderPosition.BEFOREEND);

    for(let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
      renderFilmCard(filmsListContainerComponent, films[i], allFilmscomments[films[i].id]);
    }

    if (films.length > FILM_COUNT_PER_STEP) {
      let renderedFilmCount = FILM_COUNT_PER_STEP;

      const showMoreButtonComponent = new ShowMoreButtonView();
      render(filmsListContainerComponent, showMoreButtonComponent, RenderPosition.AFTEREND);

      showMoreButtonComponent.setShowMoreButtonClickHandler(() => {
        films
          .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
          .forEach((film) => renderFilmCard(filmsListContainerComponent, film, allFilmscomments[film.id]));

        renderedFilmCount += FILM_COUNT_PER_STEP;

        if (renderedFilmCount >= films.length) {
          remove(showMoreButtonComponent);
        }
      });
    }

    const extraFilmsListContainerElements = mainElement.querySelectorAll('.films-list--extra .films-list__container');

    Array.from(extraFilmsListContainerElements).forEach((extraFilmsListContainerElement) => {
      for(let i = 0; i < EXTRA_FILM_COUNT; i++) {
        renderFilmCard(extraFilmsListContainerElement, films[i], allFilmscomments[films[i].id]);
      }
    });
  }
};

renederFilms();

const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

render(footerStatisticsElement, new TotalFilmNumberView(films.length), RenderPosition.AFTERBEGIN);
