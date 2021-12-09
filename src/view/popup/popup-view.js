import AbstarctView from '../abstract-view.js';
import {createPopupTemplate} from './popup.tpl.js';

export default class PopupView extends AbstarctView {
  #film = null;
  #comments = null;

  constructor (film, comments) {
    super();
    this.#film = film;
    this.#comments = comments;
  }

  get template() {
    return createPopupTemplate(this.#film, this.#comments);
  }
}
