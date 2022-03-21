import client from "./client";

export const postToken = (token) => {
  let endpoint = "/token";
  const dataJson = {
    token,
  };
  return client.post(endpoint, dataJson, {}, false);
};

export default {
  postToken,
};
