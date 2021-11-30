const filmsToFilterMap = {
  all: {
    filterName: 'All movies',
    number: () => 0
  },
  watchlist: {
    filterName: 'Watchlist ',
    number: (films) => films.filter((film) => film.userDetails.isInWatchlist).length
  },
  history: {
    filterName: 'History ',
    number: (films) => films.filter((film) => film.userDetails.isWatched).length
  },
  favorites: {
    filterName: 'Favorites ',
    number: (films) => films.filter((film) => film.userDetails.isFavourite).length
  }
};

export const generateFilter = (films) => Object.entries(filmsToFilterMap).map(([filterId, filterDetails]) => ({
  id: filterId,
  name: filterDetails.filterName,
  number: filterDetails.number(films)
}));
