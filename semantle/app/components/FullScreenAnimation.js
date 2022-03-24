import React, { useState, useEffect } from "react";
import LottieView from "lottie-react-native";
import { StyleSheet, View, Text, Image } from "react-native";

export default function FullScreenAnimation(
  { animation = require("../../assets/animations/confetti.json") },
  ref
) {
  const confettiRef = useRef(null);

  function fire() {
    setTimeout(() => {
      confettiRef.current.play();
    }, 50);
  }

  return {
    fire: fire,
    FullScreenAnimation: (
      <View
        pointerEvents="none"
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          height: "100%",
          position: "absolute",
        }}
      >
        <LottieView
          ref={confettiRef}
          resizeMode="cover"
          style={{
            height: "100%",
          }}
          loop={false}
          source={require("../../assets/animations/confetti.json")}
        />
      </View>
    ),
  };
}
