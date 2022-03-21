import cache from "./cache";
import * as Analytics from "expo-firebase-analytics";
import { v4 as uuidv4 } from "uuid";

async function setScreen(screenName) {
  await Analytics.setAnalyticsCollectionEnabled(true);

  Analytics.setCurrentScreen(screenName);
}

async function getUser() {
  const user = await cache.getData("FLIXPIX::USERID");
  if (user) {
    return user;
  } else {
    const userID = uuidv4();
    cache.storeData("FLIXPIX::USERID", userID);
    return userID;
  }
}

async function logEvent(title, sender = "", screen = "", purpose = "") {
  await Analytics.setAnalyticsCollectionEnabled(true);
  const user = await getUser();
  Analytics.logEvent(title, { sender, user, screen, purpose });
}

export default { setScreen, logEvent };
