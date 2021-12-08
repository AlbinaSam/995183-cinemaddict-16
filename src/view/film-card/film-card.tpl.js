import dayjs from 'dayjs';

export const createFilmCardTemplate = (film, comments) => {
  const {filmInfo, userDetails} = film;
  const {poster, title, totalRating, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favourite} = userDetails;

  const formatDuration = () => {
    const minutesInHour = 60;
    const hours = Math.trunc(runtime/minutesInHour);
    let minutes = runtime % minutesInHour;
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
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${formattedDuration}</span>
      <span class="film-card__genre">${genre.join(', ')}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${description}</p>
    <span class="film-card__comments">${comments.length} comments</span>
  </a>
  <div class="film-card__controls">
    <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlist ? activeControlItemClassName : ''}" type="button">Add to watchlist</button>
    <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${alreadyWatched ? activeControlItemClassName : ''}" type="button">Mark as watched</button>
    <button class="film-card__controls-item film-card__controls-item--favorite ${favourite ? activeControlItemClassName : ''}" type="button">Mark as favorite</button>
  </div>
</article>`;
};
