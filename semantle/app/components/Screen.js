// import React from "react";
import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Platform,
  StatusBar,
} from "react-native";
import Fade from "./Fade";

function Screen({ children, style }) {
  console.log(Platform.OS, StatusBar.currentHeight);
  return (
    <View style={[styles.screen, style]}>
      <SafeAreaView style={[styles.screen, style]}>
        <Fade style={[styles.view, style]}>{children}</Fade>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight/2,
  },
  view: {
    flex: 1,
  },
});

export default Screen;
