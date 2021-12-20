import MainNavigationView from './view/main-navigation/main-navigation-view';
import TotalFilmNumberView from './view/footer-statistics/footer-statistics-view';
import {RenderPosition, render} from './utils/render';
import {generateFilm, allFilmscomments} from './mock/film';
import {generateFilter} from './mock/filter';
import {FilmAmounts} from './consts';
import FilmsPresenter from './presenter/films-presenter';
import {generateUserStatus} from './utils/utils';

const films = new Array(FilmAmounts.FILM_AMOUNT).fill().map((i, idx) => generateFilm(idx));

const filters = generateFilter(films);
const userProfileStatus = generateUserStatus(films);

const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const mainNavigationComponent = new MainNavigationView(filters);
render(mainElement, mainNavigationComponent, RenderPosition.AFTERBEGIN);

new FilmsPresenter(mainNavigationComponent).init(films, allFilmscomments, userProfileStatus);
const footerStatisticsElement = footerElement.querySelector('.footer__statistics');

render(footerStatisticsElement, new TotalFilmNumberView(films.length), RenderPosition.AFTERBEGIN);
