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
function AppText({ style, onPress, children, fontWeight }) {
  return (
    <Text
      onPress={onPress}
      style={[
        {
          fontFamily:
            fontWeight < 450
              ? fonts[0]
              : fontWeight < 550
              ? fonts[1]
              : fontWeight < 650
              ? fonts[2]
              : fontWeight < 750
              ? fonts[3]
              : fonts[4],
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export default AppText;
