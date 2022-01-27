import MainNavigationView from './view/main-navigation/main-navigation-view';
import TotalFilmNumberView from './view/footer-statistics/footer-statistics-view';
import StatisticsView from './view/statistics/statistics-view';

import FilmsModel from './model/films-model';
import CommentsModel from './model/comments-model';
import FilterModel from './model/filter-model';

import FilmsPresenter from './presenter/films-presenter';
import FilterPresenter from './presenter/filter-presenter';

import {RenderPosition, render, remove} from './utils/render';
import {STATISTICS_LINK} from './consts';

import ApiService from './services/api-service';
import {END_POINT, AUTHORIZATION} from './services/api-service';

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));

const commentsModel = new CommentsModel(new ApiService(END_POINT, AUTHORIZATION), filmsModel);

const filterModel = new FilterModel();

const mainElement = document.querySelector('.main');

const mainNavigationComponent = new MainNavigationView();

new FilterPresenter(mainNavigationComponent, filterModel, filmsModel);

const filmsPresenter = new FilmsPresenter(mainElement, filmsModel, commentsModel, filterModel);
filmsPresenter.init();

let statisticsComponent = null;

const handleNavItemClick = (navItem) => {
  if (navItem === STATISTICS_LINK) {

    filmsPresenter.destroy();

    mainNavigationComponent.setActiveClass();

    statisticsComponent = new StatisticsView(filmsModel.films);

    render(mainNavigationComponent, statisticsComponent, RenderPosition.AFTEREND);

  } else if (statisticsComponent !== null) {

    remove(statisticsComponent);

    statisticsComponent = null;

    mainNavigationComponent.removeActiveClass();

    filmsPresenter.init();
  }
};

filmsModel.init().finally(() => {
  render(mainElement, mainNavigationComponent, RenderPosition.AFTERBEGIN);
  mainNavigationComponent.setNavClickHandler(handleNavItemClick);

  const footerStatisticsElement = document.querySelector('.footer__statistics');
  render(footerStatisticsElement, new TotalFilmNumberView(filmsModel.films.length), RenderPosition.AFTERBEGIN);
});
