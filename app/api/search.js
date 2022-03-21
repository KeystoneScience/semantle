import client from "./client";

const endpoint = "/search";

const get = (type, searchString) => {
  return client.get(
    endpoint + "?type=" + type + "&searchString=" + searchString
  );
};

export default {
  get,
};
