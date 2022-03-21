import React, { useState, useRef, useEffect } from "react";
import { LogBox, View, AppState, Alert, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import OfflineNotice from "./app/components/OfflineNotice";
import cache from "./app/utility/cache";
import AppNavigator from "./app/navigation/AppNavigator";
import * as Updates from "expo-updates";
import navigationTheme from "./app/navigation/navigationTheme";
import Screen from "./app/components/Screen";
import { AppearanceProvider } from "react-native-appearance";
import colors from "./app/config/colors";
import firebase from "firebase/app";
import { StatusBar } from "expo-status-bar";
import * as Notifications from "expo-notifications";
const firebaseConfig = {
  apiKey: "AIzaSyA0i6h4Fnxl42CAD38RDXjaD7WJy87d5Js",
  authDomain: "flixpix-c0aac.firebaseapp.com",
  databaseURL: "https://flixpix-c0aac.firebaseio.com",
  projectId: "flixpix-c0aac",
  storageBucket: "flixpix-c0aac.appspot.com",
  messagingSenderId: "550017886361",
  appId: "1:550017886361:web:a7c442926c63348a9db008",
  measurementId: "G-2BK68J4EK6",
};

// firebase.initializeApp(firebaseConfig);
Text.defaultProps = Text.defaultProps || {}; //Disable dynamic type in IOS
Text.defaultProps.allowFontScaling = false;

export default function App() {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    LogBox.ignoreLogs([
      "VirtualizedLists should never be nested",
      "Could not get abbr from name",
    ]);
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current &&
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      checkUpdates();
    }

    appState.current = nextAppState;
  };

  async function checkUpdates() {
    try {
      const storedUpdate = await cache.getUpdateData("OTA_update_data");
      if (
        storedUpdate &&
        (storedUpdate === "awaiting" || storedUpdate === "expired")
      ) {
        await cache.storeData("OTA_update_data", "none");
        await Updates.reloadAsync();
      } else {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          cache.storeData("OTA_update_data", "awaiting");
          // ... notify user of update ...
          if (storedUpdate && storedUpdate === "expired_long") {
            await Updates.reloadAsync();
          }
        }
      }
    } catch (e) {
      // handle or log error
    }
  }

  LogBox.ignoreAllLogs(true);

  return (
    <AppearanceProvider>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style="light" />
        <Screen>
          <NavigationContainer theme={navigationTheme}>
            <AppNavigator />
          </NavigationContainer>
        </Screen>
      </View>
    </AppearanceProvider>
  );
}
