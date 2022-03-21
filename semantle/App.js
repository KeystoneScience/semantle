import { StyleSheet, Text, View } from "react-native";
import Home from "./app/screens/Home";
import { StatusBar } from "expo-status-bar";
// import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AppLoading from "expo-app-loading";
import {
  BalooBhaina2_400Regular,
  BalooBhaina2_500Medium,
  BalooBhaina2_600SemiBold,
  BalooBhaina2_700Bold,
  BalooBhaina2_800ExtraBold,
} from "@expo-google-fonts/baloo-bhaina-2";
import { useFonts } from "@expo-google-fonts/baloo-bhaina-2";

var statusBarHeight = StatusBar.currentHeight;
export default function App() {
  let [fontsLoaded] = useFonts({
    BalooBhaina2_400Regular,
    BalooBhaina2_500Medium,
    BalooBhaina2_600SemiBold,
    BalooBhaina2_700Bold,
    BalooBhaina2_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="auto" />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: statusBarHeight,
  },
});
