import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { logger, transportFunctionType } from "react-native-logs";
import client from "../api/client";

var USER_ID = null;
const customTransport = (props) => {
  handleTransport(props);
  console.log(props.msg);
};

async function handleTransport(props) {
  if (!USER_ID) {
    let userObj = await getData("SEMANTLE::USER", false);
    USER_ID = userObj?.userID;
  }

  props.msg += " |USER: " + USER_ID;
  return await client.post("log", props, {}, false);
}

const config = {
  transport: customTransport,
};

var log = logger.createLogger(config);

const prefix = "cache";
const expiryInMinutes = 10080;
const tempDataExpiryInMinutes = 8;
const updateExpiryInMinutes = 1440;

const clearAsyncStorage = async () => {
  AsyncStorage.clear();
};

const storeData = async (key, value) => {
  try {
    const item = {
      value,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(prefix + key, JSON.stringify(item));
  } catch (e) {
    console.log(error);
  }
};

const removeData = async (key) => {
  await AsyncStorage.removeItem(prefix + key);
};

const isExpired = (item, time) => {
  const now = dayjs();
  const storedTime = dayjs(item.timestamp);
  return now.diff(storedTime, "minute") > time;
};

const getData = async (key, checkExpired = true, expireyTime) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(value);
    log.debug("getData" + JSON.stringify({ key, value, item }));
    if (!item) return null;
    if (expireyTime) {
      if (isExpired(item, expireyTime) && checkExpired) {
        await AsyncStorage.removeItem(prefix + key);
        return null;
      }
    } else if (isExpired(item, updateExpiryInMinutes) && checkExpired) {
      // Command Query Separation (CQS)
      await AsyncStorage.removeItem(prefix + key);
      return null;
    }
    return item.value;
  } catch (error) {
    log.error(
      `An error occurred: \n ${JSON.stringify({
        key: key,
        checkExpired,
        expireyTime,
        error: error,
      })}`
    );
    console.log(error);
  }
};

const getUpdateData = async (key, checkExpired = true) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(value);
    if (!item) return null;
    if (isExpired(item, updateExpiryInMinutes) && checkExpired) {
      // Command Query Separation (CQS)
      const now = dayjs();
      const storedTime = dayjs(item.timestamp);
      await AsyncStorage.removeItem(prefix + key);
      if (now.diff(storedTime, "minute") > 7200) {
        return "expired_long";
      }
      return "expired";
    }
    return item.value;
  } catch (error) {
    console.log(error);
  }
};

const checkNewGetData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(prefix + key);
    const item = JSON.parse(value);
    if (!item) return null;
    if (isExpired(item, tempDataExpiryInMinutes)) {
      return null;
    }
    return item.value;
  } catch (error) {
    console.log(error);
  }
};

const addToData = async (key, value) => {
  const data = await getData(key, false);
  if (data) {
    data.push(value);
    storeData(key, data);
  } else {
    storeData(key, [value]);
  }
};

export default {
  storeData,
  getData,
  getUpdateData,
  checkNewGetData,
  clearAsyncStorage,
  removeData,
  addToData,
};
