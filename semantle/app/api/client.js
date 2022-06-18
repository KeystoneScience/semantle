import { create } from "apisauce";
import cache from "../utility/cache";

const ENVIORMENT = "prod";

const apiClient = create({
  baseURL: `https://4m9ls7nsk5.execute-api.us-east-2.amazonaws.com/prod/`,
});

//caches get requests
const get = apiClient.get;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);
  if (response.ok) {
    return response;
  }

  return response;
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
    return response;
  } else if (!setCache) {
    return response;
  }

  return { ok: true, data: [] };
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
