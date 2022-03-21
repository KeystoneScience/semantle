import { create } from "apisauce";
import cache from "../utility/cache";

const apiClient = create({
  baseURL: "https://44tq0n57v6.execute-api.us-east-1.amazonaws.com/Staging", //"https://api.themoviedb.org/3/discover/", //"https://44tq0n57v6.execute-api.us-east-1.amazonaws.com/Staging",
});

//caches get requests
const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);

  if (response.ok) {
    cache.storeData(url, response.data);
    return response;
  }

  const data = await cache.getData(url);
  return data ? { ok: true, data } : response;
};

const post = apiClient.post;
apiClient.post = async (
  url,
  data,
  axiosConfig,
  setCache = true,
  log = false
) => {
  const response = await post(url, data, axiosConfig);
  if (log) {
    console.log("RESPONSE_RAW", response);
  }
  if (response.ok) {
    if (setCache) {
      cache.storeData(url, response.data);
    }
    return response;
  } else if (!setCache) {
    return response;
  }

  const dataFound = await cache.getData(url);
  return data ? { ok: true, data: dataFound } : { ok: true, data: [] };
};

const patch = apiClient.patch;
apiClient.patch = async (url, data, setCache = true, log = false) => {
  const response = await patch(url, data);
  if (log) {
    console.log("RESPONSE_RAW", response);
  }
  if (response.ok) {
    if (setCache) {
      cache.storeData(url, response.data);
    }
    return response;
  } else if (!setCache) {
    return response;
  }

  const dataFound = await cache.getData(url);
  return data ? { ok: true, data: dataFound } : { ok: true, data: [] };
};

const put = apiClient.put;
apiClient.put = async (
  url,
  data,
  axiosConfig,
  setCache = true,
  log = false
) => {
  const response = await put(url, data, axiosConfig);
  if (log) {
    console.log("RESPONSE_RAW", response);
  }
  if (response.ok) {
    if (setCache) {
      cache.storeData(url, response.data);
    }
    return response;
  } else if (!setCache) {
    return response;
  }

  const dataFound = await cache.getData(url);
  return data ? { ok: true, data: dataFound } : { ok: true, data: [] };
};

export default apiClient;
