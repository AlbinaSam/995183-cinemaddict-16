export const sortByDate = (filmA, filmB) => filmB.filmInfo.release.date - filmA.filmInfo.release.date;

export const sortByRating = (filmA, filmB) => filmB.filmInfo.totalRating - filmA.filmInfo.totalRating;
