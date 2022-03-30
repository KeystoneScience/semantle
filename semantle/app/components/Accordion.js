import React, { Component } from "react";
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
import colors from "../configs/colors";
// import colors from "../../../config/colors";
export default class Accordian extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: false,
      children: "",
      titleIcon: "",
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          ref={this.accordian}
          onPress={() => this.toggleExpand()}
          activeOpacity={0.6}
        >
          <View
            style={[
              styles.row,
              {
                backgroundColor: this.state.expanded
                  ? "rgba(0,0,0,0)"
                  : "rgba(18, 18, 18, 0)",
              },
            ]}
          >
            {this.props.titleIcon}
            <AppText fontWeight={550} style={[styles.title, styles.font]}>
              {this.props.title}
            </AppText>
            <Icon
              name={
                this.state.expanded
                  ? "keyboard-arrow-up"
                  : "keyboard-arrow-down"
              }
              size={30}
              color={colors.darkenColor(colors.colors.backgroundColor, 80)}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {/* {this.state.expanded && (
          <View style={styles.child}>
            <Text style={styles.childtxt}>{this.props.data}</Text>
          </View>
        )} */}
        {this.state.expanded && (
          <View style={{ width: "100%", height: "auto" }}>
            {this.props.children}
          </View>
        )}
      </View>
    );
  }

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  };
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    // marginLeft: 10,
    fontWeight: "500",
    color: colors.darkenColor(colors.colors.backgroundColor, 20),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: "center",
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
