import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import Constants from "expo-constants";
import colors from "../configs/colors";

export default function Header() {
  return (
    <View style={{ zIndex: 1 }}>
      {/* <View
        style={{
          backgroundColor: colors.colors.grooveColorPallet[2],
          height: Constants.statusBarHeight,
        }}
      /> */}
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.colors.grooveColorPallet[2],
          height: 40,
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          zIndex: 1,
        }}
      >
        <Text
          style={{
            color: colors.colors.white,
            fontSize: 21,
            fontWeight: "800",
            marginLeft: 10,
            textAlign: "center",
            marginRight: 10,
          }}
        >
          Semantle
        </Text>
      </View>
    </View>
  );
}
