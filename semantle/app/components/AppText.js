import React from "react";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";
import * as Localization from "expo-localization";
import i18n from "i18n-js";
import translate from "../configs/translate";

const fonts = [
  "BalooBhaina2_400Regular",
  "BalooBhaina2_500Medium",
  "BalooBhaina2_600SemiBold",
  "BalooBhaina2_700Bold",
  "BalooBhaina2_800ExtraBold",
];
function AppText({ style, onPress, children, fontWeight, translate = true }) {
  if (translate) {
    if (typeof children === "string") {
      if (i18n.t(children).toString().slice(0, 8) != "[missing") {
        // console.log(i18n.t(children));
        children = "test";
        // children = i18n.t(children);
      }
    }
  }

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
