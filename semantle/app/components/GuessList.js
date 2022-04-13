import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import useColors from "../configs/useColors";
// tableHead: ["#", "Guess", "Similarity", "	Getting close?"],
import AppText from "./AppText";
function GuessList({
  guessCount,
  guess,
  similarity = 0,
  percentile,
  lastGuess,
  notFound,
  lowestPercentile = 1,
}) {
  const colors = useColors();
  if (guess == null) {
    return <View />;
  }
  const styles = StyleSheet.create({
    tableHead: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.lightenColor(colors.colors.fadeListColor, 95),
      flex: 1,
      textAlign: "center",
    },
  });
  if (lastGuess && notFound) {
    return (
      <View
        style={{
          width: "100%",
          height: 40,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: lastGuess ? 2 : 0,
          borderRadius: 5,
          borderColor: colors.checkTheme("original")
            ? colors.colors.red
            : "rgba(255,100,70,.7)",
          flexDirection: "row",
          paddingHorizontal: 5,
          backgroundColor: colors.checkTheme("original")
            ? null
            : "rgba(255,100,70,.7)",
        }}
      >
        <AppText
          fontWeight={600}
          style={{
            color: "rgba(255,255,255,.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 17,
          }}
        >
          {guess}
        </AppText>
      </View>
    );
  }
  const a = colors.checkTheme("original")
    ? 0
    : (0.75 * percentile || 0) / 1000 + (0.25 * similarity) / 100;
  return (
    <View
      style={{
        width: "100%",
        height: 40,
        alignItems: "center",
        justifyContent: "flex-start",
        borderWidth: lastGuess || percentile == 1000 ? 2 : 0,
        borderRadius: 5,
        borderColor:
          percentile == 1000
            ? colors.colors.fadeListColor
            : colors.colors.grooveColorPallet[1],
        flexDirection: "row",
        paddingHorizontal: 5,
        backgroundColor: colors.convertColorToRGBA(
          colors.colors.fadeListColor,
          a
        ),
      }}
    >
      <View
        style={{
          width: "10%",
        }}
      >
        <AppText
          fontWeight={600}
          style={[
            styles.tableHead,
            {
              textAlign: "left",
            },
          ]}
        >
          {guessCount + 1}
        </AppText>
      </View>
      <View style={{ width: "35%" }}>
        <AppText
          fontWeight={600}
          style={[
            styles.tableHead,
            {
              // width: "50%",
            },
          ]}
        >
          {guess}
        </AppText>
      </View>
      <View style={{ width: "27%" }}>
        <AppText
          fontWeight={600}
          style={[
            styles.tableHead,
            {
              // width: "20%",
            },
          ]}
        >
          {Math.round(similarity * 100) / 100 + "%"}
        </AppText>
      </View>
      <View
        style={{
          width: "28%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {colors.checkTheme("original") && percentile && percentile != 1000 ? (
          <ProgressBar colors={colors} percentile={percentile} />
        ) : (
          <AppText
            fontWeight={600}
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
              : similarity > lowestPercentile * 100
              ? "?"
              : "far"}
          </AppText>
        )}
      </View>
    </View>
  );
}

function ProgressBar({ percentile, colors }) {
  return (
    <View
      style={{
        height: "100%",
        width: "80%",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        display: "flex",
      }}
    >
      <View
        style={{
          width: "100%",
          position: "relative",
          borderWidth: 1,
          borderColor: colors.colors.white,
          height: "20%",
          display: "flex",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${(percentile / 1000) * 100}%`,
            backgroundColor: colors.colors.fadeListColor,
          }}
        />
      </View>
      <AppText
        style={{
          textAlign: "center",
          color: colors.colors.white,
          width: "100%",
          fontSize: 12,
        }}
      >
        {percentile}/1000
      </AppText>
    </View>
  );
}

export default GuessList;
