import React, { Component, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableWithoutFeedback,
} from "react-native";
import AppText from "./AppText";
import Icon from "react-native-vector-icons/MaterialIcons";
import useColors from "../configs/useColors";
// import colors from "../../../config/colors";
export default function Accordian({ data, children, titleIcon, title }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(expanded);

  useEffect(() => {
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  function toggleExpand() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  }

  const styles = StyleSheet.create({
    title: {
      fontSize: 20,
      // marginLeft: 10,
      fontWeight: "500",
      // color: colors.darkenColor(colors.colors.backgroundColor, 20),
    },
    row: {
      flexDirection: "row",
      justifyContent: "flex-start",
      height: 56,
      paddingLeft: 25,
      paddingRight: 18,
      alignItems: "center",
      position: "relative",
      // backgroundColor: colors.fg01,
      borderBottomWidth: 0,
      borderColor: "rgba(18, 18, 18, 0)",
    },
    parentHr: {
      height: 0,
      color: "red",
      width: "100%",
    },
    child: {
      backgroundColor: "rgba(18, 18, 18, 0.66)",
      padding: 16,
    },
    childtxt: {
      color: "white",
    },
  });
  return (
    <View>
      <TouchableOpacity onPress={() => toggleExpand()} activeOpacity={0.6}>
        <View
          style={[
            styles.row,
            {
              backgroundColor: expanded
                ? "rgba(0,0,0,0)"
                : "rgba(18, 18, 18, 0)",
            },
          ]}
        >
          <View
            style={{
              width: 25,
              display: "flex",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            {titleIcon}
          </View>
          <AppText fontWeight={550} style={[styles.title, styles.font]}>
            {title}
          </AppText>
          <View style={{ position: "absolute", right: 10 }}>
            <Icon
              name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
              size={30}
              color={colors.darkenColor(colors.colors.backgroundColor, 80)}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.parentHr} />
      {/* {this.state.expanded && (
          <View style={styles.child}>
            <Text style={styles.childtxt}>{this.props.data}</Text>
          </View>
        )} */}
      {expanded && (
        <View style={{ width: "100%", height: "auto" }}>{children}</View>
      )}
    </View>
  );
}
