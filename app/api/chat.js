import client from "./client";
const endpoint = "/chat";
export const getChat = (groupID) => {
  const dataJson = {
    groupID,
  };
  return client.post(endpoint, dataJson, {}, false);
};

export default {
  getChat,
};
