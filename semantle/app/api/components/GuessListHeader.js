import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
// tableHead: ["#", "Guess", "Similarity", "	Getting close?"],
function GuessListHeader(props) {
  return (
    <View
      style={{
        width: "100%",
        // height: 30,
        alignItems: "center",
        flexDirection: "row",
        // justifyContent: "space-around",
        padding: 5,
        // overflow: "Visible",
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
        Guess
      </Text>
      <Text
        style={[
          styles.tableHead,
          {
            // width: "20%",
          },
        ]}
      >
        Similarity
      </Text>
      <Text
        style={[
          styles.tableHead,
          {
            // width: "30%",
          },
        ]}
      >
        close
      </Text>
    </View>
  );
}

export default GuessListHeader;

const styles = StyleSheet.create({
  tableHead: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    // marginBottom: 5,
    textAlign: "center",
    flex: 1,
  },
});
