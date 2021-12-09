import AbstarctView from '../abstract-view.js';
import {createShowMoreButtonTemplate} from './show-more-button.tpl.js';

export default class ShowMoreButtonView extends AbstarctView {
  get template () {
    return createShowMoreButtonTemplate();
  }

  setShowMoreButtonClickHandler = (callback) => {
    this._callback.showMoreClick = callback;
    this.element.addEventListener('click', this.#showMoreButtonClickHandler);
  }

  #showMoreButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.showMoreClick();
  }
}
