import AbstarctView from '../abstract-view.js';
import {createFilmsListContainerTemplate} from './film-list-container.tpl.js';


export default class FilmsListContainerView extends AbstarctView {
  get template() {
    return createFilmsListContainerTemplate();
  }
}
