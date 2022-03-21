import client from "./client";
const endpoint = "/movies";
export const getMovies = (page, groupID) => {
  // const page =
  //   lastMovieString === "start"
  //     ? 0
  //     : Math.ceil((parseInt(lastMovieString, 10) + 1) / 20);
  const dataJson = {
    groupID,
    page,
    version: "1.0.4.2"
  };
  return client.post(endpoint, dataJson, {}, false);
};

const getProviders = (movieID, type, region = "US") => {
  return client.get(
    endpoint + "?movieID=" + movieID + "&region=" + region + "&type=" + type
  );
};

export default {
  getMovies,
  getProviders,
};
