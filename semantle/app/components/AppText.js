import React from "react";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";
const fonts = [
  "BalooBhaina2_400Regular",
  "BalooBhaina2_500Medium",
  "BalooBhaina2_600SemiBold",
  "BalooBhaina2_700Bold",
  "BalooBhaina2_800ExtraBold",
];
function AppText(props) {
  return (
    <Text
      style={[
        {
          fontFamily:
            props.fontWeight < 450
              ? fonts[0]
              : props.fontWeight < 550
              ? fonts[1]
              : props.fontWeight < 650
              ? fonts[2]
              : props.fontWeight < 750
              ? fonts[3]
              : fonts[4],
        },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
}

export default AppText;
