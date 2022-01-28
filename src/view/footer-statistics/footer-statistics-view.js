import AbstractView from '../abstract-view.js';
import {createFooterStatisticsTemplate} from './footer-statistics.tpl.js';

export default class FooterStatisticsView extends AbstractView {
  #filmsNumber = null;

  constructor(filmsNumber) {
    super();
    this.#filmsNumber = filmsNumber;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#filmsNumber);
  }
}
