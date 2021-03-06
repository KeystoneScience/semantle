import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
  Dimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import useColors from "../configs/useColors";
import AppText from "./AppText";
import * as Haptics from "expo-haptics";
import { FontAwesome5 } from "@expo/vector-icons";

const MAX_PHONE_HEIGHT = 730;

var keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],

  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],

  ["Z", "X", "C", "V", "B", "N", "M", "DELETE"],
];

export default function VirtualKeyboard({
  onKey,
  onBackspace,
  onEnter,
  onClear,
}) {
  const colors = useColors();

  if (colors.checkTheme("original")) {
    return <View></View>;
  }

  const styles = StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 2,
      marginRight: 2,
      padding: 2,
    },
    key: {
      minWidth: "8%",
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 5,
      paddingRight: 5,
      borderRadius: 12,
      marginLeft: 3,
      marginRight: 3,

      shadowColor: "#000",
    },
    keyText: {
      fontSize: 23,
      color: colors.lightenColor(colors.colors.keybordBttnColor, 85),
      textAlign: "center",
      fontWeight: "bold",
    },
  });
  return (
    <View
      intensity={100}
      style={{
        position: "absolute",
        width: "100%",
        bottom: Dimensions.get("window").height > MAX_PHONE_HEIGHT ? 30 : 0,
        alignSelf: "center",
        // backgroundColor: "rgba(0,0,0,0.5)",
        paddingBottom: 10,
      }}
    >
      {keys.map((row, i) => (
        <View key={i + "_KEY_ROW"} style={styles.row}>
          {row.map((key, j) => {
            const [isPressed, setIsPressed] = React.useState(false);
            return (
              <View key={j + "_KEY"} style={{ position: "relative" }}>
                <Pressable
                  unstable_pressDelay={0}
                  hitSlop={{
                    bottom: i == 2 ? 20 : 2,
                    left: j == 0 ? 20 : 2,
                    right: j == row.length - 1 ? 40 : 2,
                    top: i == 0 ? 20 : 2,
                  }}
                  style={({ pressed }) => ({
                    zIndex: -1,
                    backgroundColor: pressed
                      ? colors.darkenColor(colors.colors.keybordBttnColor, 65)
                      : colors.colors.keybordBttnColor,
                    minWidth: "8%",
                    height: 42,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 2,
                    paddingBottom: 2,
                    paddingLeft: key === "DELETE" ? 10 : 5,
                    paddingRight: key === "DELETE" ? 10 : 5,
                    borderRadius: 12,
                    marginLeft: i == 2 && j == 0 ? 60 : 3,
                    marginRight: 3,
                    marginBottom: 3.5,
                    shadowOffset: {
                      width: 0,
                      height: pressed ? 2 : 6,
                    },
                    shadowColor: colors.darkenColor(
                      colors.colors.keybordBttnColor,
                      65
                    ),
                    transform: [
                      {
                        translateY: pressed ? 4 : 0,
                      },
                    ],
                    shadowOpacity: 1,
                    shadowRadius: 0,
                    elevation: 2,
                  })}
                  onPressIn={() => {
                    setIsPressed(true);
                    if (key === "DEL" || key === "DELETE") {
                      if (Platform.OS === "ios")
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      onBackspace();
                    } else if (key === "ENTER") {
                      if (Platform.OS === "ios")
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                      onEnter();
                    } else {
                      if (Platform.OS === "ios")
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onKey(key);
                    }
                  }}
                  onPressOut={() => setIsPressed(false)}
                  delayLongPress={300}
                  onLongPress={() => {
                    if (key === "DEL" || key === "DELETE") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                      onClear();
                    }
                  }}
                >
                  {key === "DELETE" ? (
                    <FontAwesome5 name="backspace" size={24} color="white" />
                  ) : (
                    <AppText fontWeight={600} key={j} style={[styles.keyText]}>
                      {key}
                    </AppText>
                  )}
                </Pressable>
                {isPressed && (
                  <View
                    style={{
                      position: "absolute",
                      backgroundColor: colors.darkenColor(
                        colors.colors.keybordBttnColor,
                        65
                      ),
                      width: "125%",
                      height: 60,
                      top: -50,
                      alignSelf: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      elevation: 2,
                    }}
                  >
                    {key === "DELETE" ? (
                      <FontAwesome5 name="backspace" size={27} color="white" />
                    ) : (
                      <AppText
                        key={j}
                        fontWeight={600}
                        style={[styles.keyText, { fontSize: 27 }]}
                      >
                        {key}
                      </AppText>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ))}
      {Dimensions.get("window").height > MAX_PHONE_HEIGHT && (
        <Pressable
          unstable_pressDelay={0}
          style={({ pressed }) => ({
            zIndex: -1,
            backgroundColor: pressed
              ? colors.darkenColor(colors.colors.checkButtonColor, 65)
              : colors.colors.checkButtonColor,
            width: "50%",
            height: 42,
            display: "flex",
            justifyContent: "center",
            alignSelf: "center",
            alignItems: "center",
            paddingTop: 2,
            paddingBottom: 2,
            borderRadius: 12,
            marginRight: 3,
            marginTop: 10,
            marginBottom: 3.5,
            shadowOffset: {
              width: 0,
              height: pressed ? 2 : 6,
            },
            shadowColor: colors.darkenColor(colors.colors.checkButtonColor, 65),
            transform: [
              {
                translateY: pressed ? 4 : 0,
              },
            ],
            shadowOpacity: 1,
            shadowRadius: 0,
            elevation: 2,
          })}
          onPressIn={() => {
            if (Platform.OS === "ios")
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onEnter();
          }}
        >
          <AppText fontWeight={600} style={[styles.keyText]}>
            GUESS
          </AppText>
        </Pressable>
      )}
    </View>
  );
}
