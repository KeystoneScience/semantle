import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { BlurView } from "expo-blur";
import AppText from "./AppText";
function GuessListHeader(props) {
  return (
    <BlurView
      tint="light"
      intensity={50}
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
      <View>
        <AppText
          style={[
            styles.tableHead,
            {
              width: 15,
            },
          ]}
        >
          #
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
        Guess
      </AppText>
      <AppText
        style={[
          styles.tableHead,
          {
            // width: "20%",
          },
        ]}
      >
        Similarity
      </AppText>
      <AppText
        style={[
          styles.tableHead,
          {
            // width: "30%",
          },
        ]}
      >
        Distance
      </AppText>
    </BlurView>
  );
}

export default GuessListHeader;

const styles = StyleSheet.create({
  tableHead: {
    fontSize: 18,
    // fontWeight: "bold",
    color: "black",
    // marginBottom: 5,
    textAlign: "center",

    flex: 1,
  },
});
