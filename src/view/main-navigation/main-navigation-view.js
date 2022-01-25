import AbstractView from '../abstract-view.js';
import {createMainNavigationTemplate} from './main-navigation.tpl.js';

export default class MainNavigationView extends AbstractView {
  #currentActive = null;

  get template() {
    return createMainNavigationTemplate();
  }

  setNavClickHandler = (callback) => {
    this._callback.navClick = callback;
    this.element.addEventListener('click', this.#navClickHandler);
  }

  #navClickHandler = (evt) => {

    evt.preventDefault();

    if (evt.target.tagName !== 'A') {
      return;
    }

    this._callback.navClick(evt.target.getAttribute('href').slice(1));
  }

  setActiveClass = () => {
    this.#currentActive = this.element.querySelector('.main-navigation__item--active');
    this.#currentActive.classList.remove('main-navigation__item--active');
    this.element.querySelector('.main-navigation__additional').classList.add('main-navigation__additional--active');
  }

  removeActiveClass = () => {
    this.element.querySelector('.main-navigation__additional').classList.remove('main-navigation__additional--active');
    this.#currentActive.classList.add('main-navigation__item--active');
  }
}
