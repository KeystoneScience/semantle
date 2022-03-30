import { StyleSheet, Text, View, LogBox, AppState } from "react-native";
import Home from "./app/screens/Home";
import { StatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
import ThemeContext from "./app/configs/context";
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
import colors from "./app/configs/colors";

import "react-native-gesture-handler";

Text.defaultProps = Text.defaultProps || {}; //Disable dynamic type in IOS
Text.defaultProps.allowFontScaling = false;
export default function App() {
  let [fontsLoaded] = useFonts({
    BalooBhaina2_400Regular,
    BalooBhaina2_500Medium,
    BalooBhaina2_600SemiBold,
    BalooBhaina2_700Bold,
    BalooBhaina2_800ExtraBold,
  });

  const appState = useRef(AppState.currentState);
  const [theme, setTheme] = useState("");

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
        //prompt the user that an update is available. Ask them if they want to update
        //check the cache to see if we asked them within the last hour
        const lastChecked = await cache.getData(
          "SEMANTLE_lastUpdateCheck",
          true
        );
        if (lastChecked) {
          return;
        }
        Alert.alert(
          "Update Available",
          "Restart the app to apply the update?",
          [
            {
              text: "Yes",
              onPress: () => Updates.reloadAsync(),
            },
            {
              text: "No",
              onPress: () => {
                cache.storeData("SEMANTLE_lastUpdateCheck", true);
              },
              style: "cancel",
            },
          ]
        );
      }
    } catch (e) {
      // handle or log error
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
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <View style={styles.container}>
        <StatusBar style="light" />
        <NavigationContainer theme={navigationTheme}>
          <AppNavigator />
        </NavigationContainer>
      </View>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colors.backgroundColor,
  },
});
