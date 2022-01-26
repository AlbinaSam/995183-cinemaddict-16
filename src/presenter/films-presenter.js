import LoadingView from '../view/loading/loading-view';
import UserProfileView from '../view/user-profile/user-profile-view';
import SortingView from '../view/sorting/sorting-view';
import FilmsView from '../view/films/films-view';
import FilmsListContainerView from '../view/film-list-container/film-list-container-view';
import NoFilmsView from '../view/no-films/no-films-view';
import FilmCardView from '../view/film-card/film-card-view';
import ShowMoreButtonView from '../view/show-more-button/show-more-button-view';
import PopupView from '../view/popup/popup-view';
import {FilmAmounts, SortType, UserAction, UpdateType, FilterType} from '../consts';
import {RenderPosition, render, remove, replace} from '../utils/render';
import {isEscapePressed, generateUserStatus} from '../utils/utils';
import {sortByDate, sortByRating} from '../utils/sorting';
import {filter} from '../utils/filter';

export default class FilmsPresenter {
  #filmsContainer = null;
  #filmsModel = null;
  #commentsModel = null;
  #filterModel = null;

  #loadingComponent = new LoadingView();
  #filmsComponent = null;
  #filmsListContainerComponent = null;
  #userProfileComponent = null;
  #noFilmsComponent = null;
  #sortingComponent = null;
  #showMoreButtonComponent = null;
  #popupComponent = null;

  #renderedFilmCount = FilmAmounts.FILM_AMOUNT_PER_STEP;
  #filmsComponents = new Map();
  #currentSortType = SortType.DEFAULT;
  #filterType = FilterType.ALL;
  #activeFilmId = null;
  #isLoading = true;

  constructor (filmsContainer, filmsModel, commentsModel, filterModel) {
    this.#filmsContainer = filmsContainer;

    this.#filmsModel = filmsModel;
    this.#commentsModel = commentsModel;
    this.#filterModel = filterModel;

    //this.init();
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = [...this.#filmsModel.films];
    const filteredFilms = filter[this.#filterType](films);

    switch(this.#currentSortType) {
      case SortType.DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  init = () => {
    this.#filmsComponent = new FilmsView(this.films);
    render(this.#filmsContainer, this.#filmsComponent, RenderPosition.BEFOREEND);

    this.#filmsModel.addObserver(this.#handleModelEvent);
    this.#commentsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);

    this.#renderFilms();
  }

  destroy = () => {
    this.#clearFilms({resetRenderedFilmCount: true, resetSortType:true});

    remove(this.#filmsComponent);

    this.#filmsModel.deleteObserver(this.#handleModelEvent);
    this.#commentsModel.deleteObserver(this.#handleModelEvent);
    this.#filterModel.deleteObserver(this.#handleModelEvent);
  }

  #renderUserProfile = () => {
    const userProfileStatus = generateUserStatus(this.films);
    this.#userProfileComponent = new UserProfileView(userProfileStatus);
    const headerElement = document.querySelector('.header');
    render(headerElement, this.#userProfileComponent, RenderPosition.BEFOREEND);
  }

  #handleSortTypeChange = (sortType) => {

    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearFilms({resetRenderedFilmCount: true});
    this.#renderFilms();
  }

  #renderSort = () => {
    this.#sortingComponent = new SortingView(this.#currentSortType);
    render(this.#filmsComponent, this.#sortingComponent, RenderPosition.BEFOREBEGIN);
    this.#sortingComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #clearFilms = ({resetRenderedFilmCount = false, resetSortType = false} = {}) => {
    this.#filmsComponents.forEach((component) => remove(component));
    this.#filmsComponents.clear();

    remove(this.#loadingComponent);
    remove(this.#userProfileComponent);
    remove(this.#sortingComponent);
    remove(this.#filmsListContainerComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noFilmsComponent) {
      remove(this.#noFilmsComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FilmAmounts.FILM_AMOUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(this.films.length, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  }

  #renderFilms = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmsCount = this.films.length;

    if (filmsCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderUserProfile();
    this.#renderSort();
    this.#renderFilmsListContainer();

    this.#renderNeededFilmsAmount(films.slice(0, Math.min(filmsCount, this.#renderedFilmCount)));

    if (filmsCount > FilmAmounts.FILM_AMOUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
    //this.#renderExtraFilms();
  }

  #renderFilmsListContainer = () => {
    const filmList = this.#filmsComponent.element.querySelector('.films-list');
    this.#filmsListContainerComponent = new FilmsListContainerView();
    render(filmList, this.#filmsListContainerComponent, RenderPosition.BEFOREEND);
  }

  #renderNeededFilmsAmount = (films) => {
    films.forEach((film) => this.#renderFilm(film));
  }

  #updateFilm = (updatedFilm) => {
    this.#renderFilm(updatedFilm);
  }

  #resetDisablingStates = () => {
    this.#popupComponent.updateData({
      isSaving: false,
      isDeleting: false,
      scrollPosition: this.#popupComponent.element.scrollTop
    });
  }

  #handleViewAction = async (actionType, updateType, update) => {

    switch(actionType) {
      case UserAction.UPDATE_FILM:

        try {
          await this.#filmsModel.updateFilm(updateType, update);
        } catch(err) {

          if (this.#popupComponent) {
            this.#popupComponent.shake();
          } else {
            this.#filmsComponents.get(update.id).shake();
          }
        }

        break;

      case UserAction.ADD_COMMENT: {

        this.#popupComponent.updateData({
          isSaving: true,
          scrollPosition: this.#popupComponent.element.scrollTop
        });

        try {
          await this.#commentsModel.addComment(updateType, update, this.#activeFilmId);

          this.#popupComponent.updateData({
            localComment: {
              comment: '',
              emotion: '',
            }
          });

        } catch(err) {
          this.#popupComponent.shake(this.#resetDisablingStates);
        }
        break;
      }

      case UserAction.DELETE_COMMENT: {
        this.#popupComponent.updateData({
          isDeleting: true,
          deletingCommentId: update.id,
          scrollPosition: this.#popupComponent.element.scrollTop
        });

        try {
          await this.#commentsModel.deleteComment(updateType, update, this.#activeFilmId);
        } catch (err) {
          this.#popupComponent.shake(this.#resetDisablingStates);
        }

        break;
      }
    }
  }

  #handleModelEvent = (updateType, data) => {

    switch(updateType) {
      case UpdateType.PATCH:
        this.#updateFilm(data);
        this.#reRenderPopup(data);

        break;

      case UpdateType.MINOR:
        this.#clearFilms();
        this.#renderFilms();
        this.#reRenderPopup(data);

        break;

      case UpdateType.MAJOR:
        this.#clearFilms({resetRenderedFilmCount: true, resetSortType: true});
        this.#renderFilms();
        this.#reRenderPopup(data);

        break;

      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderFilms();

        break;

      case UpdateType.COMMENTS_LOADED:
        this.#renderPopup(data, this.#commentsModel.comments);

        break;
    }
  }

  #renderLoading = () => {
    const filmList = this.#filmsComponent.element.querySelector('.films-list');
    render(filmList, this.#loadingComponent, RenderPosition.AFTERBEGIN);
  }

  #reRenderPopup = (data) => {

    if (this.#activeFilmId !== null  && this.#activeFilmId === data.id) {

      this.#popupComponent.updateComments(this.#commentsModel.comments);

      this.#popupComponent.updateData(
        {...data, isSaving: false, isDeleting: false, deletingCommentId: '', scrollPosition: this.#popupComponent.element.scrollTop}
      );
    }
  }

  #closePopup = () => {
    if (this.#popupComponent === null) {
      return;
    }

    this.#activeFilmId = null;

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
    }
  }

  #loadComments = (film) => {
    this.#commentsModel.init(film);
  }

  #renderPopup = (film, comments) => {
    this.#closePopup();
    this.#activeFilmId = film.id;

    const body = document.querySelector('body');
    const footerElement = document.querySelector('.footer');

    this.#popupComponent = new PopupView(film, comments);

    const handlePopupAddToWatchList = () => {
      const latestFilm = this.films.find((item) => item.id === film.id);

      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...latestFilm,  userDetails: {...latestFilm.userDetails, watchlist: !latestFilm.userDetails.watchlist}}
      );
    };

    const handlePopupAlreadyWatchedClick = () => {
      const latestFilm = this.films.find((item) => item.id === film.id);

      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...latestFilm,  userDetails: {...latestFilm.userDetails, alreadyWatched: !latestFilm.userDetails.alreadyWatched}}
      );
    };

    const handlePopupAddToFavoriteClick = () => {
      const latestFilm = this.films.find((item) => item.id === film.id);

      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...latestFilm,  userDetails: {...latestFilm.userDetails, favourite: !latestFilm.userDetails.favourite}}
      );
    };

    const handleCloseButtonClick = () => {
      this.#closePopup();
    };

    const handleDeleteClick = (id) => {

      this.#handleViewAction(
        UserAction.DELETE_COMMENT,
        UpdateType.PATCH,
        this.#commentsModel.comments.find((item) => item.id === id)
      );
    };

    const handleCommentSubmit = (newComment) => {
      this.#handleViewAction(
        UserAction.ADD_COMMENT,
        UpdateType.PATCH,
        newComment
      );
    };

    this.#popupComponent.setAddToWatchClickHandler(handlePopupAddToWatchList);
    this.#popupComponent.setAlreadyWatchedClickHandler(handlePopupAlreadyWatchedClick);
    this.#popupComponent.setAddToFavoriteClickHandler(handlePopupAddToFavoriteClick);
    this.#popupComponent.setCloseButtonClickHandler(handleCloseButtonClick);
    this.#popupComponent.setDeleteClickHandler(handleDeleteClick);
    this.#popupComponent.setCommentSubmitHandler(handleCommentSubmit);

    render(footerElement, this.#popupComponent, RenderPosition.AFTEREND);
    body.classList.add('hide-overflow');
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #renderFilm = (film) => {
    const prevFilmComponent = this.#filmsComponents.get(film.id);

    const filmCardComponent = new FilmCardView(film);

    this.#filmsComponents.set(film.id, filmCardComponent);

    const handleFilmCardClick = () => {
      this.#closePopup();
      this.#loadComments(film);
    };

    const handleAddToWatchListClick = () => {
      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...film,  userDetails: {...film.userDetails, watchlist: !film.userDetails.watchlist}}
      );
    };

    const handleAlreadyWatchedClick = () => {
      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...film,  userDetails: {...film.userDetails, alreadyWatched: !film.userDetails.alreadyWatched}}
      );
    };

    const handleAddToFavoriteClick = () => {
      this.#handleViewAction(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        {...film,  userDetails: {...film.userDetails, favourite: !film.userDetails.favourite}}
      );
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
    }
  }

  #renderNoFilms = () => {
    this.#noFilmsComponent = new NoFilmsView(this.#filterType);
    const filmList = this.#filmsComponent.element.querySelector('.films-list');
    render(filmList, this.#noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  #handleShowMoreButtonClick = () => {
    const filmsAmount = this.films.length;

    const newRenderedFilmCount = Math.min(filmsAmount, this.#renderedFilmCount + FilmAmounts.FILM_AMOUNT_PER_STEP);

    const filmsAmountToRender = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderNeededFilmsAmount(filmsAmountToRender);

    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmsAmount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();

    render(this.#filmsListContainerComponent, this.#showMoreButtonComponent, RenderPosition.AFTEREND);

    this.#showMoreButtonComponent.setShowMoreButtonClickHandler(this.#handleShowMoreButtonClick);
  }

  // #renderExtraFilms = () => {
  //   const mainElement = document.querySelector('.main');
  //   const extraFilmsListContainerElements = mainElement.querySelectorAll('.films-list--extra .films-list__container');

  //   Array.from(extraFilmsListContainerElements).forEach((extraFilmsListContainerElement) => {
  //     for(let i = 0; i < EXTRA_FILM_COUNT; i++) {
  //       this.#renderFilm(extraFilmsListContainerElement, this.#films[i], this.#commentsModel[this.#films[i].id]);
  //     }
  //   });
  // }
}
