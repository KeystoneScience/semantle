import React, { useState, useEffect } from "react";
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
function AppText({
  style = {},
  onPress,
  children,
  fontWeight,
  translate = true,
  adjustFont = false,
}) {
  const [adjustedStyle, setAdjustedStyle] = useState({});
  const [adjustedChildren, setAdjustedChildren] = useState(children);
  useEffect(() => {
    if (translate) {
      if (typeof children === "string") {
        if (i18n.t(children).toString().slice(0, 8) != "[missing") {
          const originalLength = children.length;
          const adjChild = i18n.t(children);
          setAdjustedChildren(adjChild);
          if (originalLength < adjChild.length && adjustFont) {
            let adjStyle = {};

            //if style is an array of objects, merge each into one object

            if (Array.isArray(style)) {
              adjStyle = Object.assign({}, ...style);
            } else {
              adjStyle = { ...style };
            }

            if (adjStyle.fontSize) {
              adjStyle.fontSize = Math.floor(
                (adjStyle.fontSize * originalLength) / adjChild.length
              );
            } else {
              adjStyle.fontSize = Math.floor(
                (16 * originalLength) / adjChild.length
              );
            }
            setAdjustedStyle(adjStyle);
          }
        } else {
          setAdjustedChildren(children);
        }
      } else {
        setAdjustedChildren(children);
      }
    } else {
      setAdjustedChildren(children);
    }
  }, [i18n.locale, children]);

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
        adjustedStyle,
      ]}
    >
      {adjustedChildren}
    </Text>
  );
}

export default AppText;
