import React from "react";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";
function AppText({ style, onPress, children }) {
  return (
    <Text
      onPress={onPress}
      style={[
        {
          fontFamily: "BalooBhaina2_600SemiBold",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export default AppText;
