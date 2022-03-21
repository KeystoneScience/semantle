import { StyleSheet, Text, View } from "react-native";
import Home from "./app/screens/Home";
import { StatusBar } from "expo-status-bar";
// import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
var statusBarHeight = StatusBar.currentHeight;
export default function App() {
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
