import React, { Children } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";

import colors from "../config/colors";
import * as Haptics from "expo-haptics";
function AppButton({
  title,
  onPress,
  color = "primary",
  hollow = false,
  style,
  children,
}) {
  function pressButton() {
    if (Platform.OS === "ios") Haptics.selectionAsync();
    onPress();
  }

  return (
    <TouchableOpacity
      delayPressIn={0}
      style={[
        styles.button,
        {
          backgroundColor: hollow ? "rgba(0,0,0,0)" : colors[color],
          borderWidth: hollow ? 5 : 0,
          padding: hollow ? 15 : 20,
          borderColor: colors[color],
        },
        style,
      ]}
      onPress={() => pressButton()}
    >
      <Text
        style={[styles.text, { color: hollow ? colors[color] : colors.white }]}
      >
        {title}
      </Text>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "90%",
    marginVertical: 10,
    alignSelf: "center",
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default AppButton;
