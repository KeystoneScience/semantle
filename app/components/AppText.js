import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  PixelRatio,
} from "react-native";
import colors from "../config/colors";
import i18n from "i18n-js";
import translate from "../config/translate";

var modifiedStyle = {};
function AppText({ children, style = false, description = "false", numberOfLines=4 }) {
  if (style) {
    modifiedStyle = JSON.parse(JSON.stringify(style));
    if (Platform.OS === "ios") {
      modifiedStyle.fontSize = style.fontSize;
    }
    if (style.fontSize && style.fontSize > 2) {
      if (Platform.OS === "android") {
        modifiedStyle.fontSize = style.fontSize - 2;
      }
    }
  } else {
    modifiedStyle = styles.text;
  }
  if (description === "coupon extra") {
    return (
      <Text
        numberOfLines={numberOfLines}
        adjustsFontSizeToFit
        style={[styles.text, modifiedStyle]}
      >
        {children}
      </Text>
    );
  }
  return <Text style={[styles.text, modifiedStyle]}>{children}</Text>;
}
const styles = StyleSheet.create({
  text: {
    fontSize: Platform.OS === "android" ? 16 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
    color: colors.primaryText,
  },
});

export default AppText;
