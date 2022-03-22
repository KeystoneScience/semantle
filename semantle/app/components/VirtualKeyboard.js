import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";
import colors from "../configs/colors";
import * as Haptics from "expo-haptics";
import { FontAwesome5 } from "@expo/vector-icons";

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
  return (
    <View
      intensity={100}
      style={{
        position: "absolute",
        width: "100%",
        bottom: 0,

        alignSelf: "center",
        // backgroundColor: "rgba(0,0,0,0.5)",
        paddingBottom: 10,
      }}
    >
      {keys.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((key, j) => (
            <Pressable
              unstable_pressDelay={0}
              hitSlop={2}
              style={({ pressed }) => ({
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
                marginLeft: 3,
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
                if (key === "DEL" || key === "DELETE") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  onBackspace();
                } else if (key === "ENTER") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  onEnter();
                } else {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onKey(key);
                }
              }}
              delayLongPress={300}
              onLongPress={() => {
                if (key === "DEL" || key === "DELETE") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  onClear();
                } else if (key === "ENTER") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  onEnter();
                } else {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onKey(key);
                }
              }}
            >
              {key === "DELETE" ? (
                <FontAwesome5 name="backspace" size={24} color="white" />
              ) : (
                <Text key={j} style={[styles.keyText]}>
                  {key}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
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
    fontSize: 20,
    color: colors.lightenColor(colors.colors.keybordBttnColor, 85),
    textAlign: "center",
    fontWeight: "bold",
  },
});
