import AbstarctView from '../abstract-view.js';
import {createSortingTemplate} from './sorting.tpl.js';

export default class SortingView extends AbstarctView {
  get template () {
    return createSortingTemplate();
  }
}
