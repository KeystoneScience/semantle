import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
function GuessListHeader(props) {
  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        padding: 7,
        backgroundColor: "rgba(58, 12, 163, .1)",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(58, 12, 163, .5)",
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
        Distance
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
