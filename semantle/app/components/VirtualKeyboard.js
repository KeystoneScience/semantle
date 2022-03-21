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

var keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],

  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],

  ["DEL", "Z", "X", "C", "V", "B", "N", "M", "ENTER"],
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
        bottom: 60,

        alignSelf: "center",
        // backgroundColor: "rgba(0,0,0,0.5)",
        paddingBottom: 20,
      }}
    >
      {keys.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((key, j) => (
            <Pressable
              hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? "rgba(58, 12, 163, .1)"
                  : "rgba(58, 12, 163, .6)",
                minWidth: "8%",
                height: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 5,
                paddingRight: 5,
                borderRadius: 12,
                marginLeft: 3,
                marginRight: 3,
              })}
              onPress={() => {
                if (key === "DEL") {
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
              onLongPress={() => {
                if (key === "DEL") {
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
              <Text key={j} style={[styles.keyText]}>
                {key}
              </Text>
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
  },
  keyText: {
    fontSize: 20,
    color: colors.colors.white,
    textAlign: "center",
    fontWeight: "bold",
  },
});
