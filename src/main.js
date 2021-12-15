import MainNavigationView from './view/main-navigation/main-navigation-view';
import TotalFilmNumberView from './view/footer-statistics/footer-statistics-view';
import {RenderPosition, render} from './utils/render';
import {generateFilm, allFilmscomments} from './mock/film';
import {generateFilter} from './mock/filter';
import {FILM_COUNT} from './consts';
import FilmsPresenter from './presenter/films-presenter';
import {generateUserStatus} from './utils/utils';

const films = [];
for (let i = 0; i < FILM_COUNT; i++) {
  films.push(generateFilm(i));
}

const filters = generateFilter(films);
const userProfileStatus = generateUserStatus(films);

const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const mainNavigationComponent = new MainNavigationView(filters);
render(mainElement, mainNavigationComponent, RenderPosition.AFTERBEGIN);

const filmsPresenter = new FilmsPresenter(mainNavigationComponent);
filmsPresenter.init(films, allFilmscomments, userProfileStatus);
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

render(footerStatisticsElement, new TotalFilmNumberView(films.length), RenderPosition.AFTERBEGIN);
