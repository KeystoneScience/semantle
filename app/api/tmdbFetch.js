import client from "./client";

const getMovies = (type, batchNumber, genres) => {
  let genresString = "";
  if (genres.length > 0) {
    genresString = "&with_genres=";
    for (index = 0; index < genres.length; ++index) {
      genresString += genres[index];
      if (index < genres.length - 1) {
        genresString += "|";
      }
    }
  }
  let endpoint =
    "/" +
    type +
    "?api_key=109c43f3ea2e42c294d7e549339ddfee&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=" +
    batchNumber +
    genresString;
  return client.get(endpoint);
};

export default {
  getMovies,
};
