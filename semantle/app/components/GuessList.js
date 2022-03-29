import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import colors from "../configs/colors";
// tableHead: ["#", "Guess", "Similarity", "	Getting close?"],
import AppText from "./AppText";
function GuessList({
  guessCount,
  guess,
  similarity = 0,
  percentile,
  lastGuess,
  notFound,
}) {
  if (guess == null) {
    return <View />;
  }
  if (lastGuess && notFound) {
    return (
      <View
        style={{
          width: "100%",
          height: 40,
          alignItems: "center",
          borderWidth: lastGuess ? 2 : 0,
          borderRadius: 5,
          borderColor: colors.colors.grooveColorPallet[1],
          flexDirection: "row",
          paddingHorizontal: 5,
          backgroundColor: "rgba(255,100,70,.7)",
        }}
      >
        <AppText
          style={{
            color: colors.colors.white,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 19,
          }}
        >
          {guess}
        </AppText>
      </View>
    );
  }
  const a = (0.75 * percentile || 0) / 1000 + (0.25 * similarity) / 100;
  return (
    <View
      style={{
        width: "100%",
        height: 40,
        alignItems: "center",
        borderWidth: lastGuess ? 2 : 0,
        borderRadius: 5,
        borderColor: colors.colors.grooveColorPallet[1],
        flexDirection: "row",
        paddingHorizontal: 5,
        backgroundColor: colors.convertColorToRGBA(
          colors.colors.fadeListColor,
          a
        ),
      }}
    >
      <View>
        <AppText
          style={[
            styles.tableHead,
            {
              width: 20,
            },
          ]}
        >
          {guessCount + 1}
        </AppText>
      </View>
      <AppText
        style={[
          styles.tableHead,
          {
            // width: "50%",
          },
        ]}
      >
        {guess}
      </AppText>
      <AppText
        style={[
          styles.tableHead,
          {
            // width: "20%",
          },
        ]}
      >
        {Math.round(similarity * 100) / 100 + "%"}
      </AppText>
      <AppText
        style={[
          styles.tableHead,
          {
            // width: "30%",
          },
        ]}
      >
        {percentile
          ? percentile == 1000
            ? "FOUND"
            : 1000 - percentile
          : "far"}
      </AppText>
    </View>
  );
}

export default GuessList;

const styles = StyleSheet.create({
  tableHead: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.lightenColor(colors.colors.fadeListColor, 95),

    textAlign: "center",
    flex: 1,
  },
});
