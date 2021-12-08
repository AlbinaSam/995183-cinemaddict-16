export const createFilmsTemplate = (films) => (
  `<section class="films">
    <section class="films-list">
    </section>
    ${films.length > 0 ?
    `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
      <div class="films-list__container"></div>
    </section>

    <section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>
      <div class="films-list__container"></div>
    </section>` : ''}
  </section>`
);
