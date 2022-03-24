import { StyleSheet, Text, View, LogBox, AppState } from "react-native";
import Home from "./app/screens/Home";
import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
import navigationTheme from "./app/navigation/navigationTheme";
import AppNavigator from "./app/navigation/AppNavigator";
import AppLoading from "expo-app-loading";
import {
  BalooBhaina2_400Regular,
  BalooBhaina2_500Medium,
  BalooBhaina2_600SemiBold,
  BalooBhaina2_700Bold,
  BalooBhaina2_800ExtraBold,
} from "@expo-google-fonts/baloo-bhaina-2";
import * as Updates from "expo-updates";
import { useFonts } from "@expo-google-fonts/baloo-bhaina-2";
import Screen from "./app/components/Screen";
import colors from "./app/configs/colors";

import "react-native-gesture-handler";
var statusBarHeight = StatusBar.currentHeight;
export default function App() {
  let [fontsLoaded] = useFonts({
    BalooBhaina2_400Regular,
    BalooBhaina2_500Medium,
    BalooBhaina2_600SemiBold,
    BalooBhaina2_700Bold,
    BalooBhaina2_800ExtraBold,
  });

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  async function checkUpdates() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        // NOTIFY USER HERE
        Updates.reloadAsync();
      }
    } catch (e) {
      // HANDLE ERROR HERE
    }
  }

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

  LogBox.ignoreLogs([
    "Non-serializable values were found in the navigation state",
  ]);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colors.backgroundColor,
  },
});
