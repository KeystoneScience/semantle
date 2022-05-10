import React from "react";
import { View, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import useColors from "../configs/useColors";
import { Ionicons } from "@expo/vector-icons";
// import soundPlayer from "../../../media/soundPlayer";

function ExitButton({ onPress, iconName = "md-close" }) {
  const colors = useColors();
  function pressButton() {
    // soundPlayer.playSound(require("../../../assets/sounds/swoosh.wav"));
    onPress();
  }
  return (
    <View style={styles.ExitDiv}>
      <SafeAreaView>
        <TouchableOpacity
          delayPressIn={0}
          style={styles.Exit}
          onPress={() => pressButton()}
        >
          <Ionicons name={iconName} size={32} color={colors.darkGrey} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  Exit: {
    width: 64,
    height: 56,
    position: "absolute",
    alignSelf: "center",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  ExitDiv: {
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
  },
});
export default ExitButton;
