import client from "./client";

const getPrimaryWord = (primaryWood) => {
  return client.get(`/${primaryWood}/${primaryWood}`);
};

const getOtherWords = (primaryWord, otherWord) => {
  return client.get(`/${primaryWord}/${otherWord}`);
};

const getNearbyWords = (word) => {
  return client.get(`/nearby/${word}`);
};

export default {
  getPrimaryWord,
  getOtherWords,
  getNearbyWords,
};

// export const makeGroup = (
//   groupTitle,
//   groupFlags,
//   screenName,
//   pushToken,
//   region,
//   ratitingsSystem,
//   language
// ) => {
//   let providersString = "";
//   let genresString = "";
//   let ratingsString = "";

//   if (groupFlags.genres.length > 0) {
//     genresString = "";
//     for (var index = 0; index < groupFlags.genres.length; ++index) {
//       genresString += groupFlags.genres[index];
//       if (index < groupFlags.genres.length - 1) {
//         genresString += "|";
//       }
//     }
//   }

//   if (groupFlags.providers.length > 0) {
//     providersString = "";
//     for (var index = 0; index < groupFlags.providers.length; ++index) {
//       providersString += groupFlags.providers[index];
//       if (index < groupFlags.providers.length - 1) {
//         providersString += "|";
//       }
//     }
//   }

//   if (groupFlags.ratings.length > 0) {
//     ratingsString = "";
//     for (var index = 0; index < groupFlags.ratings.length; ++index) {
//       ratingsString += groupFlags.ratings[index];
//       if (index < groupFlags.ratings.length - 1) {
//         ratingsString += "|";
//       }
//     }
//   }

//   const dataJson = {
//     name: groupTitle,
//     type: groupFlags.type,
//     genresString: genresString,
//     providersString: providersString,
//     ratingsString: ratingsString,
//     screenNames: [screenName],
//     pushTokens: pushToken ? [pushToken] : [],
//     region,
//     ratitingsSystem,
//     langaugePreference: language,
//     version: "1.0.4.2",
//   };

//   return client.post(endpoint, dataJson, {}, false);
// };

// export const joinGroup = (joinCode, screenName, pushToken) => {
//   const dataJson = {
//     joinCode,
//     screenName,
//     pushToken,
//     version: "1.0.4.2",
//   };
//   return client.patch(endpoint, dataJson, false);
// };

// export const getJoinCode = (groupID) => {
//   const dataJson = {
//     groupID,
//   };
//   return client.put("/join-code", dataJson, {}, false, false);
// };

// export const refreshGroups = (groups) => {
//   const dataJson = {
//     groupIDs: groups,
//   };

//   return client.post("/groups", dataJson, {}, false);
// };

// export default {
//   makeGroup,
//   getStats,
//   joinGroup,
//   getJoinCode,
//   refreshGroups,
// };
