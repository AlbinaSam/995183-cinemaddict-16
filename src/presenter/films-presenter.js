import UserProfileView from '../view/user-profile/user-profile-view';
import SortingView from '../view/sorting/sorting-view';
import FilmsView from '../view/films/films-view';
import FilmsListContainerView from '../view/film-list-container/film-list-container-view';
import NoFilmsView from '../view/no-films/no-films-view';
import FilmCardView from '../view/film-card/film-card-view';
import ShowMoreButtonView from '../view/show-more-button/show-more-button-view';
import PopupView from '../view/popup/popup-view';
import {FilmAmounts, DEFAULT_FILTER_NAME, SortType} from '../consts';
import {RenderPosition, render, remove, replace} from '../utils/render';
import {isEscapePressed, updateItem} from '../utils/utils';
import {sortByDate, sortByRating} from '../utils/sorting';
export default class FilmsPresenter {
  #filmsContainer = null;
  #userProfileStatus = null;
  #filmsComponent = null;
  #filmsListContainerComponent = null;

  #currentSortType = SortType.DEFAULT;

  #sortingComponent = null;
  #noFilmsComponent = new NoFilmsView(DEFAULT_FILTER_NAME);
  #showMoreButtonComponent = new ShowMoreButtonView();

  #renderedFilmCount = FilmAmounts.FILM_AMOUNT_PER_STEP;

  #films = [];
  #allFilmsComments = [];
  #filmsComponents = new Map();
  #popupComponent = null;

  #sourcedFilms = [];

  constructor (filmsContainer) {
    this.#filmsContainer = filmsContainer;
  }

  init = (films, allFilmsComments, userProfileStatus) => {
    this.#films = [...films];
    this.#sourcedFilms = [...films];
    this.#allFilmsComments = allFilmsComments;
    this.#userProfileStatus = userProfileStatus;
    this.#filmsComponent = new FilmsView(this.#films);
    render(this.#filmsContainer, this.#filmsComponent, RenderPosition.AFTEREND);
    this.#renderFilms(this.#filmsListContainerComponent);
  }

  #renderUserProfile = () => {
    const userProfileComponent = new UserProfileView(this.#userProfileStatus);
    const headerElement = document.querySelector('.header');
    render(headerElement, userProfileComponent, RenderPosition.BEFOREEND);
  }

  #sortFilms = (sortType) => {
    switch(sortType) {
      case SortType.DATE:
        this.#films.sort(sortByDate);
        break;
      case SortType.RATING:
        this.#films.sort(sortByRating);
        break;
      default:
        this.#films = this.#sourcedFilms;
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmsList();
    remove(this.#sortingComponent);
    this.#renderSort(this.#currentSortType);
    this.#renderFilmsList();
  }

  #renderSort = () => {
    this.#sortingComponent = new SortingView(this.#currentSortType);
    render(this.#filmsContainer, this.#sortingComponent, RenderPosition.AFTEREND);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #clearFilmsList = () => {
    this.#filmsComponents.forEach((component) => remove(component));
    this.#filmsComponents.clear();
    this.#renderedFilmCount = FilmAmounts.FILM_AMOUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #renderFilms = () => {
    if (this.#films.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderUserProfile();
    this.#renderSort();
    this.#renderFilmsListContainer();
    this.#renderFilmsList();
    //this.#renderExtraFilms();
  }

  #renderFilmsListContainer = () => {
    const filmList = this.#filmsComponent.element.querySelector('.films-list');
    this.#filmsListContainerComponent = new FilmsListContainerView();
    render(filmList, this.#filmsListContainerComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsList = () => {
    this.#renderNeededFilmsAmount(0, Math.min(this.#films.length, FilmAmounts.FILM_AMOUNT_PER_STEP));

    if (this.#films.length > FilmAmounts.FILM_AMOUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderNeededFilmsAmount = (from, to) => {
    this.#films
      .slice(from, to)
      .forEach((film) => this.#renderFilm(film, this.#allFilmsComments[film.id]));
  }

  #updateFilm = (updatedFilm) => {
    this.#films = updateItem(this.#films, updatedFilm);
    this.#sourcedFilms = updateItem(this.#films, updatedFilm);
    this.#renderFilm(updatedFilm, this.#allFilmsComments[updatedFilm.id]);
  }

  #closePopup = () => {

    if (this.#popupComponent === null) {
      return;
    }

    const body = document.querySelector('body');
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    remove(this.#popupComponent);
    this.#popupComponent = null;
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapePressed (evt)) {
      evt.preventDefault();
      this.#closePopup();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  #renderPopup = (film, comments) => {
    const body = document.querySelector('body');
    const footerElement = document.querySelector('.footer');

    this.#popupComponent = new PopupView(film, comments);

    const closeButton = this.#popupComponent.element.querySelector('.film-details__close-btn');
    closeButton.addEventListener('click', () => {
      this.#closePopup();
    });

    const handlePopupAddToWatchList = () => {
      this.#updateFilm({...film,  userDetails: {...film.userDetails, watchlist: !film.userDetails.watchlist}});
    };

    const handlePopupAlreadyWatchedClick = () => {
      this.#updateFilm({...film,  userDetails: {...film.userDetails, alreadyWatched: !film.userDetails.alreadyWatched}});
    };

    const handlePopupAddToFavoriteClick = () => {
      this.#updateFilm({...film,  userDetails: {...film.userDetails, favourite: !film.userDetails.favourite}});
    };

    this.#popupComponent.setAddToWatchClickHandler(handlePopupAddToWatchList);
    this.#popupComponent.setAlreadyWatchedClickHandler(handlePopupAlreadyWatchedClick);
    this.#popupComponent.setAddToFavoriteClickHandler(handlePopupAddToFavoriteClick);

    render(footerElement, this.#popupComponent, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #renderFilm = (film, comments) => {
    const prevFilmComponent = this.#filmsComponents.get(film.id);

    const filmCardComponent = new FilmCardView(film, comments);

    this.#filmsComponents.set(film.id, filmCardComponent);

    const handleFilmCardClick = () => {
      this.#closePopup();
      this.#renderPopup(film, comments);
    };

    const handleAddToWatchListClick = () => {
      this.#updateFilm({...film,  userDetails: {...film.userDetails, watchlist: !film.userDetails.watchlist}});
    };

    const handleAlreadyWatchedClick = () => {
      this.#updateFilm({...film,  userDetails: {...film.userDetails, alreadyWatched: !film.userDetails.alreadyWatched}});
    };

    const handleAddToFavoriteClick = () => {
      this.#updateFilm({...film,  userDetails: {...film.userDetails, favourite: !film.userDetails.favourite}});
    };

    filmCardComponent.setFilmCardClickHandler(handleFilmCardClick);
    filmCardComponent.setAddToWatchClickHandler(handleAddToWatchListClick);
    filmCardComponent.setAlreadyWatchedClickHandler(handleAlreadyWatchedClick);
    filmCardComponent.setAddToFavoriteClickHandler(handleAddToFavoriteClick);

    if (!prevFilmComponent) {
      render(this.#filmsListContainerComponent, filmCardComponent, RenderPosition.BEFOREEND);
    } else {
      replace(filmCardComponent, prevFilmComponent);
      remove(prevFilmComponent);

      if (!(this.#popupComponent === null)) {
        this.#closePopup();
        this.#renderPopup(film, comments);
      }
    }
  }

  #renderNoFilms = () => {
    const filmList = this.#filmsComponent.element.querySelector('.films-list');
    render(filmList, this.#noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  #handleShowMoreButtonClick = () => {
    this.#renderNeededFilmsAmount(this.#renderedFilmCount, this.#renderedFilmCount + FilmAmounts.FILM_AMOUNT_PER_STEP);

    this.#renderedFilmCount += FilmAmounts.FILM_AMOUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#films.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {

    render(this.#filmsListContainerComponent, this.#showMoreButtonComponent, RenderPosition.AFTEREND);

    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
  }

  // #renderExtraFilms = () => {
  //   const mainElement = document.querySelector('.main');
  //   const extraFilmsListContainerElements = mainElement.querySelectorAll('.films-list--extra .films-list__container');

  //   Array.from(extraFilmsListContainerElements).forEach((extraFilmsListContainerElement) => {
  //     for(let i = 0; i < EXTRA_FILM_COUNT; i++) {
  //       this.#renderFilm(extraFilmsListContainerElement, this.#films[i], this.#allFilmsComments[this.#films[i].id]);
  //     }
  //   });
  // }
}
