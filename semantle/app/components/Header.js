import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Constants from "expo-constants";
import colors from "../configs/colors";
import AppText from "./AppText";
import { Octicons } from "@expo/vector-icons";
export default function Header({ navigation, semantleGame }) {
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
          height: 35,
          flexDirection: "row",
          justifyContent: "flex-start",
          width: "100%",
          zIndex: 1,
        }}
      >
        <AppText
          onPress={() => {
            navigation.navigate("Drawer", { semantleGame });
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

        <View
          style={{
            position: "absolute",
            right: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Drawer", { semantleGame });
            }}
            style={{ width: 30, height: 30 }}
          >
            <Octicons
              name="three-bars"
              size={26}
              color={colors.darkenColor(colors.colors.backgroundColor, 45)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
