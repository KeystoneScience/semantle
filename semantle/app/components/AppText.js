import React from "react";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";
function AppText(props) {
  return (
    <Text
      style={[
        {
          fontFamily: "BalooBhaina2_600SemiBold",
        },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
}

export default AppText;
