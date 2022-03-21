// import React from "react";
import React, { useRef, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Animated } from "react-native";
import Fade from "./Fade";

function Screen({ children, style}) {
  return (
    <View style={[styles.screen, style]}>
      <Fade style={[styles.view, style]}>{children}</Fade>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  view: {
    flex: 1,
  },
});

export default Screen;

