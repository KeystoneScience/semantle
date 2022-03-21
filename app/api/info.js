import client from "./client";

const endpoint = "/info";

const getInfo = (type, id) => {
  return client.get(endpoint + "?type=" + type + "&id=" + id);
};

export default {
  getInfo,
};
