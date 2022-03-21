import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
// tableHead: ["#", "Guess", "Similarity", "	Getting close?"],
function GuessList({ index, guess, similarity, close }) {
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
      {/* <Text
        style={[
          styles.tableHead,
          {
            width: "15%",
            backgroundColor: "rgba(58, 120, 255, 1)",
          },
        ]}
      >
        #
      </Text> */}
      <Text
        style={[
          styles.tableHead,
          {
            // width: "50%",
          },
        ]}
      >
        {guess}
      </Text>
      <Text
        style={[
          styles.tableHead,
          {
            // width: "20%",
          },
        ]}
      >
        {similarity}
      </Text>
      <Text
        style={[
          styles.tableHead,
          {
            // width: "30%",
          },
        ]}
      >
        {close}
      </Text>
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
