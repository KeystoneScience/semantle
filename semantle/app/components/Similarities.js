import React from "react";
import { Text, View } from "react-native";
import useColors from "../configs/useColors";
import AppText from "./AppText";

export default function Similarities({ top, top10, rest }) {
  const colors = useColors();
  return (
    <View
      style={{
        width: "100%",
        justifyContent: "center",
        marginTop: 10,
        alignItems: "center",
      }}
    >
      {/* <AppText>Closest Words</AppText> */}
      <View
        style={{
          width: "90%",
          alignSelf: "center",
          backgroundColor: colors.darkenColor(
            colors.colors.backgroundColor,
            32
          ),
          borderRadius: 10,
          height: 100,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Segment n="1st" percent={top} colors={colors} />
        <View
          style={{
            height: "70%",
            width: 0,
            borderWidth: 1.5,
            borderColor: colors.colors.white,
          }}
        />
        <Segment n="10th" percent={top10} colors={colors} />
        <View
          style={{
            height: "70%",
            width: 0,
            borderWidth: 1.5,
            borderColor: colors.colors.white,
          }}
        />
        <Segment n="1000th" percent={rest} colors={colors} />
      </View>
    </View>
  );
}

function Segment({ n, percent, colors }) {
  return (
    <View
      style={{
        width: "30%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppText
        style={{ color: colors.colors.yellow, fontSize: 17 }}
        fontWeight={900}
      >
        {n}
      </AppText>
      <AppText
        style={{ color: colors.colors.white, fontSize: 25, lineHeight: 40 }}
        fontWeight={900}
      >
        {percent > 0 ? `${(percent * 100).toFixed(1)}%` : "_"}
      </AppText>
      <AppText
        style={{ color: colors.colors.white, fontSize: 14, lineHeight: 20 }}
      >
        Similarity
      </AppText>
    </View>
  );
}
