import AbstractView from '../abstract-view.js';
import { createTopRatedFilmsTemplate } from './top-rated.tpl.js';

export default class TopRatedView extends AbstractView {

  get template () {
    return createTopRatedFilmsTemplate();
  }
}
