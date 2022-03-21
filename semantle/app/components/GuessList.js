import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
// tableHead: ["#", "Guess", "Similarity", "	Getting close?"],
import AppText from "./AppText";
function GuessList({ guessCount, guess, similarity, percentile }) {
  return (
    <View
      style={{
        width: "100%",
        // height: 30,
        alignItems: "center",
        flexDirection: "row",
        // justifyContent: "space-around",
        padding: 5,

        backgroundColor: "rgba(58, 12, 163, .1)",
      }}
    >
      <View>
        <AppText
          style={[
            styles.tableHead,
            {
              width: 15,
            },
          ]}
        >
          {guessCount}
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
            : percentile + "/1000"
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
    color: "black",

    textAlign: "center",
    flex: 1,
  },
});
