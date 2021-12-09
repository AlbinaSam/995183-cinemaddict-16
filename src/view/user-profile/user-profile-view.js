import AbstarctView from '../abstract-view.js';
import {createUserProfileTemplate} from './user-profile.tpl.js';

export default class UserProfileView extends AbstarctView {
  #status = null;

  constructor(status) {
    super();
    this.#status = status;
  }

  get template() {
    return createUserProfileTemplate(this.#status);
  }
}
