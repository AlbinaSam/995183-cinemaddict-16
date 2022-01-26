import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {

  _data = {};

  updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);
    newElement.scrollTo(0, this._data.scrollPosition);
    this.restoreHandlers();
  }

  updateData = (update, justDataUpdating) => {

    if(!update) {
      return;
    }

    this._data = {...this._data, ...update};

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  restoreHandlers = () => {
    throw new Error('Abstract method not implemented: restoreHandlers');
  }
}
