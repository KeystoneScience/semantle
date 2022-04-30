import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppText from "./AppText";
import useColors from "../configs/useColors";
function GuessListHeader(props) {
  const colors = useColors();

  const styles = StyleSheet.create({
    tableHead: {
      fontSize: 18,
      // fontWeight: "bold",
      width: "100%",
      color: colors.lightenColor(colors.colors.backgroundColor, 75),
      // marginBottom: 5,
      textAlign: "center",

      flex: 1,
    },
  });
  return (
    <View
      // tint="light"
      // intensity={50}
      style={{
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        padding: 7,
        backgroundColor: colors.darkenColor(colors.colors.backgroundColor, 90),
        borderBottomWidth: 1,
        borderBottomColor: colors.colors.backgroundColor,
        height: 40,
      }}
    >
      <View
        style={{ width: "10%", justifyContent: "center", alignItems: "center" }}
      >
        <AppText
          fontWeight={700}
          onPress={() => {
            props.onSort("guessCount");
          }}
          style={[styles.tableHead, { textAlign: "left" }]}
        >
          #
        </AppText>
      </View>
      <View
        style={{ width: "35%", justifyContent: "center", alignItems: "center" }}
      >
        <AppText
          fontWeight={700}
          onPress={() => {
            props.onSort("guess");
          }}
          style={styles.tableHead}
        >
          Guess
        </AppText>
      </View>
      <View
        style={{ width: "27%", justifyContent: "center", alignItems: "center" }}
      >
        <AppText
          fontWeight={700}
          onPress={() => {
            props.onSort("similarity");
          }}
          style={styles.tableHead}
        >
          Similarity
        </AppText>
      </View>
      <View
        style={{ width: "28%", justifyContent: "center", alignItems: "center" }}
      >
        <AppText
          fontWeight={700}
          onPress={() => {
            props.onSort("similarity");
          }}
          style={styles.tableHead}
        >
          Distance
        </AppText>
      </View>
    </View>
  );
}

export default GuessListHeader;
