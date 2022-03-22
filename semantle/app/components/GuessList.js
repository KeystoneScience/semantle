import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import colors from "../configs/colors";
// tableHead: ["#", "Guess", "Similarity", "	Getting close?"],
import AppText from "./AppText";
function GuessList({ guessCount, guess, similarity = 0, percentile }) {
  const a = (0.5 * percentile) / 1000 + 0.5 * similarity;

  return (
    <View
      style={{
        width: "100%",
        height: 40,
        alignItems: "center",
        flexDirection: "row",
        // justifyContent: "space-around",
        // padding: 2,
        paddingHorizontal: 5,

        // backgroundColor: percentile
        //   ? percentile < 100
        //     ? "rgba(181, 23, 158, 1)"
        //     : percentile < 200
        //     ? "rgba(114, 9, 183, 1)"
        //     : percentile < 300
        //     ? "rgba(86, 11, 173, 1)"
        //     : percentile < 400
        //     ? "rgba(72, 12, 168, 1)"
        //     : percentile < 500
        //     ? "rgba(58, 12, 163, 1)"
        //     : percentile < 600
        //     ? "rgba(63, 55, 201, 1)"
        //     : percentile < 700
        //     ? "rgba(67, 97, 238, 1)"
        //     : percentile < 800
        //     ? "rgba(72, 149, 239, 1)"
        //     : percentile < 900
        //     ? "rgba(0, 103, 0, 1)"
        //     : percentile < 950
        //     ? "rgba(0, 129, 0, 1)"
        //     : percentile < 980
        //     ? "rgba(4, 154, 4, 1)"
        //     : percentile < 990
        //     ? "rgba(30, 180, 30, 1)"
        //     : percentile === 1000
        //     ? "rgba(230, 180, 0, 1)"
        //     : "rgba(55, 205, 55, 1)"
        //   : "rgba(240, 66, 66, 1)",
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
