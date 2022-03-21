import { StyleSheet, Text, View } from "react-native";
import Home from "./app/screens/Home";
import { StatusBar } from "expo-status-bar";
// import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import Screen from "./app/components/Screen";
import colors from "./app/configs/colors";

var statusBarHeight = StatusBar.currentHeight;
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Screen>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </Screen>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.colors.grooveColorPallet[2],
  },
});
