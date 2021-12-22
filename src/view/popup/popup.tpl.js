import dayjs from 'dayjs';
import {Emotions} from '../../consts.js';

const createPopupGenresTemplate = (genres) => (
  `<td class="film-details__term">${genres.length > 1 ? 'Genres':'Genre'}</td>
    <td class="film-details__cell">
      ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>
    </td>`).join('')}
  </tr>`
);

const createPopupCommentsTemplate = (comments) => {
  const formatCommentDate = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');

  return `${comments.length > 0 ? comments.map((comment) => `<li class="film-details__comment">
  <span class="film-details__comment-emoji">
    <img src="${comment.emoji}" width="55" height="55" alt="emoji-smile">
  </span>
  <div>
    <p class="film-details__comment-text">${comment.message}</p>
    <p class="film-details__comment-info">
      <span class="film-details__comment-author">${comment.authorName}</span>
      <span class="film-details__comment-day">${formatCommentDate(comment.date)}</span>
      <button class="film-details__comment-delete">Delete</button>
    </p>
  </div>
</li>`).join('') : ''}`;
};

const createPopupEmojiListTemplate = () => (
  `<div class="film-details__emoji-list">
    ${Object.values(Emotions).map((emotion) => `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`).join('')}
  </div>`
);

export const createPopupTemplate = (film, comments) => {
  const {filmInfo, userDetails, newCommentEmoji, newCommentText} = film;
  const {poster, title, alternativeTitle, totalRating, ageRating, director, writers, actors, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favourite} = userDetails;

  const genresTemplate = createPopupGenresTemplate(genre);
  const commentsTemplate = createPopupCommentsTemplate(comments);
  const emojiListTemplate = createPopupEmojiListTemplate();

  const formatReleaseDate = () => (dayjs(release.date).format('D MMMM YYYY'));
  const formattedReleaseDate = formatReleaseDate();
  const formatDuration = () => {
    const minutesInHour = 60;
    const hours = Math.trunc(runtime/minutesInHour);
    let minutes = runtime % minutesInHour;
    if (String(minutes).length === 1) {
      minutes = `0${minutes}`;
    }
    return `${hours}h ${minutes}m`;
  };
  const formattedDuration = formatDuration();
  const activeControlItemClassName = 'film-details__control-button--active';

  return `<section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">Original: ${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${actors.join(', ')}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formattedReleaseDate}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formattedDuration}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${release.releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              ${genresTemplate}
            </tr>
          </table>

          <p class="film-details__film-description">${description}</p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${watchlist ? activeControlItemClassName : ''} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${alreadyWatched ? activeControlItemClassName : ''} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${favourite ? activeControlItemClassName : ''} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${commentsTemplate}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
            ${newCommentEmoji ? `<img src="images/emoji/${newCommentEmoji}.png" width="55" height="55" alt="emoji-${newCommentEmoji}">` : ''}
          </div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${newCommentText}</textarea>
          </label>

          ${emojiListTemplate}

        </div>
      </section>
    </div>
  </form>
</section>`;
};
