// import React from "react";
import React, { useRef, useEffect, useState } from "react";
import Constants from "expo-constants";
import { Animated, Text, View, StyleSheet, Button } from "react-native";
import Fade from "./Fade";

function Screen({ children, renderIndex }) {
  const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0));
  const fadeIn = () => {
    Animated.timing(fadeAnimation, {
      useNativeDriver: true,
      toValue: 1,
      duration: 200,
    }).start();
  };

  const fullCycleFade = () => {
    fadeIn();
    setTimeout(fadeOut, 1300);
  };

  const fadeOut = () => {
    Animated.timing(fadeAnimation, {
      useNativeDriver: true,
      toValue: 0,
      duration: 200,
    }).start();
  };

  useEffect(() => {
    fullCycleFade();
  }, [renderIndex]);
  return (
    <View style={styles.container}>
      <Animated.View
        useNativeDriver={true}
        style={{
          opacity: fadeAnimation,
        }}
      >
        {children()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  fadingContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "lightseagreen",
  },
  fadingText: {
    fontSize: 28,
    textAlign: "center",
    margin: 10,
    color: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    marginVertical: 16,
  },
});

export default Screen;
