import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import Constants from "expo-constants";
import colors from "../configs/colors";
import AppText from "./AppText";
export default function Header({ navigation }) {
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
          backgroundColor: colors.colors.backgroundColor,
          height: 40,
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          zIndex: 1,
        }}
      >
        <AppText
          onPress={() => {
            navigation.navigate("Drawer");
          }}
          style={{
            color: colors.darkenColor(colors.colors.backgroundColor, 45),
            fontSize: 23,
            marginLeft: 10,
            textAlign: "center",
            marginRight: 10,
          }}
        >
          Semantle
        </AppText>
      </View>
    </View>
  );
}
