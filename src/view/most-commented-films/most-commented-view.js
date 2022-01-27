import AbstractView from '../abstract-view.js';
import {createMostCommentedFilmsTemplate} from './most-commented.tpl.js';

export default class MostCommentedView extends AbstractView {

  get template () {
    return createMostCommentedFilmsTemplate();
  }
}
