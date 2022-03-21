import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";

const Fade = ({ props, children, style, minduration = 0, mindellay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600 - minduration,
      delay: 10 - mindellay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View // Special animatable View
      style={[
        {
          zIndex: 100,
          //   ...props.style,
          opacity: fadeAnim,
          flex: 1, // Bind opacity to animated value
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
};
export default Fade;
