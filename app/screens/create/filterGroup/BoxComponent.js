import React, { useEffect } from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import colors from "../../../config/colors";
import AppText from "../../../components/AppText";

//const startingIndex = Math.floor(Math.random() * 10);
// import AvatarIcon from "./avatar";
function BoxComponent({ groupName, filterOptions }) {
  return <View style={styles.rectangle}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8,
    position: "relative",
  },
  rectangle: {
    flex: 1,
    flexDirection: "column",
    margin: 1,
    borderBottomWidth: 1.2,
    borderTopWidth: 1.2,
    borderRightWidth: 1.2,
    borderLeftWidth: 1.2,
  },
});

export default BoxComponent;
