import React from "react";
import { Text, View } from "react-native";
import colors from "../configs/colors";
function Tutorial(props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.colors.backgroundColor,
      }}
    >
      <Text>Tutorial</Text>
    </View>
  );
}

export default Tutorial;
