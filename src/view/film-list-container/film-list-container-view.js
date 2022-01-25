import AbstractView from '../abstract-view.js';
import {createFilmsListContainerTemplate} from './film-list-container.tpl.js';

export default class FilmsListContainerView extends AbstractView {
  get template() {
    return createFilmsListContainerTemplate();
  }
}
