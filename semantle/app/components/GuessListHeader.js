import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { BlurView } from "expo-blur";
import AppText from "./AppText";
import useColors from "../configs/useColors";
function GuessListHeader(props) {
  const colors = useColors();

  const styles = StyleSheet.create({
    tableHead: {
      fontSize: 18,
      // fontWeight: "bold",
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
      }}
    >
      <View>
        <AppText
          onPress={() => {
            props.onSort("guessCount");
          }}
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
        onPress={() => {
          props.onSort("guessCount");
        }}
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
        onPress={() => {
          props.onSort("similarity");
        }}
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
        onPress={() => {
          props.onSort("similarity");
        }}
        style={[
          styles.tableHead,
          {
            // width: "30%",
          },
        ]}
      >
        Distance
      </AppText>
    </View>
  );
}

export default GuessListHeader;
