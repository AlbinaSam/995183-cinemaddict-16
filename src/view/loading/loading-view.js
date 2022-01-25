import AbstractView from '../abstract-view';
import {createLoadingTemplate} from './loading.tpl';

export default class LoadingView extends AbstractView {
  get template() {
    return createLoadingTemplate();
  }
}
