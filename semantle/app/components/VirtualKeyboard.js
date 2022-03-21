import React, { Component } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";

var keys = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],

  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],

  ["DEL", "Z", "X", "C", "V", "B", "N", "M", "ENTER"],
];

export default function VirtualKeyboard() {
  return (
    <BlurView
      intensity={100}
      style={{
        position: "absolute",
        width: "100%",
        bottom: 60,

        alignSelf: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingBottom: 20,
      }}
    >
      {keys.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((key, j) => (
            <Text
              key={j}
              style={[
                styles.key,
                { width: key === "ENTER" || key === "DEL" ? null : null },
              ]}
            >
              {key}
            </Text>
          ))}
        </View>
      ))}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 7,
  },
  key: {
    fontSize: 20,
    // backgroundColor: "rgba(58, 12, 163, .1)",
    padding: 5,
    // width: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
});
