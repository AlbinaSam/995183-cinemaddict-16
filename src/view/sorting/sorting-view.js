import AbstractView from '../abstract-view.js';
import {createSortingTemplate} from './sorting.tpl.js';

export default class SortingView extends AbstractView {
  get template () {
    return createSortingTemplate();
  }
}
