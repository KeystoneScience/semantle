import client from "./client";
import cache from "../utility/cache";

const endpoint = "/vote";

export const castVote = (order, groupID, voteType) => {
  const dataJson = {
    order,
    groupID,
    voteType,
  };
  return client.patch(endpoint, dataJson, false);
};

export default {
  castVote,
};
