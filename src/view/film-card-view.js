import dayjs from 'dayjs';
import {createElement} from '../render.js';

const createFilmCardTemplate = (film, comments) => {
  const {filmInfo, userDetails} = film;
  const {poster, title, rating, release, duration, genres, description} = filmInfo;
  const {isInWatchlist, isWatched, isFavourite} = userDetails;

  const formatDuration = () => {
    const minutesInHour = 60;
    const hours = Math.trunc(duration/minutesInHour);
    let minutes = duration % minutesInHour;
    if (String(minutes).length === 1) {
      minutes = `0${minutes}`;
    }
    return `${hours}h ${minutes}m`;
  };

  const getReleaseYear = () => (dayjs(release.date).format('YYYY'));

  const releaseYear = getReleaseYear();
  const formattedDuration = formatDuration();
  const activeControlItemClassName = 'film-card__controls-item--active';

  return `<article class="film-card">
  <a class="film-card__link">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${formattedDuration}</span>
      <span class="film-card__genre">${genres.join(', ')}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isInWatchlist ? activeControlItemClassName : ''}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${isWatched ? activeControlItemClassName : ''}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${isFavourite ? activeControlItemClassName : ''}" type="button">Mark as favorite</button>
  </div>
</article>`;
};

export default class FilmCardView {
  #element = null;
  #film = null;
  #comments = null;

  constructor(film, comments) {
    this.#film = film;
    this.#comments = comments;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  get template() {
    return createFilmCardTemplate(this.#film, this.#comments);
  }

  removeElement() {
    this.#element = null;
  }
}
