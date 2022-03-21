import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import UserAvatar from "react-native-user-avatar";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import Fade from "../../components/Fade";
const CircleSize = 35;
const CircleSpacing = 28;

function Card({
  name,
  numMembers,
  onPress,
  onLongPress,
  screenNames = [],
  onSharePress,
}) {
  const usersInGroup = screenNames;
  const [currentFont, setCurrentFont] = useState(23);
  const [update, setUpdate] = useState(null);
  function pressButton() {
    onPress();
  }

  const LeftActions = () => {
    return (
      <TouchableOpacity
        onPress={onSharePress}
        style={{
          backgroundColor: colors.primary,
          width: "18%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <EvilIcons name="share-apple" size={30} color={colors.white} />
      </TouchableOpacity>
    );
  };

  const RightActions = () => {
    return (
      <TouchableOpacity
        onPress={onLongPress}
        style={{
          backgroundColor: colors.red,
          width: "18%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="ios-trash-outline" size={24} color={colors.white} />
      </TouchableOpacity>
    );
  };

  var colorArray = [
    colors.secondary,
    colors.primary,
    "#2FE079",
    "#73B758",
    "#7C57E0",
    "#5A89F8",

    "#D88645",
    "#F5D647",
  ];

  function abbreviateNumber(value) {
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.ceil(("" + value).length / 3) - 1;
    var shortValue = parseFloat(
      (suffixNum != 0 ? value / Math.pow(1000, suffixNum) : value).toPrecision(
        2
      )
    );
    if (shortValue % 1 != 0) {
      shortValue = shortValue.toFixed(2);
    }
    return shortValue + suffixes[suffixNum];
  }

  return (
    <View style={styles.shadowView}>
      <View style={styles.cardouter}>
        <Swipeable
          renderLeftActions={LeftActions}
          renderRightActions={RightActions}
          onSwipeFromLeft={() => alert("SWIPED LEFT")}
          onRightPress={() => alert("Press Right")}
        >
          <TouchableOpacity
            delayPressIn={0}
            onPress={() => pressButton()}
            onLongPress={onLongPress}
            style={styles.card}
          >
            <View style={{ flex: 1 }}>
              <View style={styles.back}>
                <View
                  style={[
                    styles.logoContainer,
                    {
                      flex:
                        numMembers >= 99
                          ? 0.3
                          : usersInGroup.length < 3
                          ? usersInGroup.length / 7
                          : 0.4,
                    },
                  ]}
                >
                  {numMembers < 99 &&
                    usersInGroup.length > 0 &&
                    usersInGroup.slice(0, 2).map((name, index) => (
                      <View
                        key={index}
                        style={{
                          zIndex: 4 - index,
                          position: "absolute",
                          left: 10 + index * CircleSpacing,
                        }}
                      >
                        <UserAvatar
                          size={CircleSize}
                          name={name}
                          bgColor={colorArray[name.length % 6]}
                        />
                      </View>
                    ))}
                  {numMembers < 99 && usersInGroup.length > 3 && (
                    <View
                      style={{
                        zIndex: 0,
                        position: "absolute",
                        left: 10 + 2 * CircleSpacing,
                      }}
                    >
                      <View
                        size={30}
                        style={[
                          styles.circle,
                          { backgroundColor: colorArray[2] },
                        ]}
                      >
                        <AppText style={styles.avatarText}>
                          +{numMembers - 2}
                        </AppText>
                      </View>
                    </View>
                  )}
                  {numMembers < 99 && usersInGroup.length == 3 && (
                    <View
                      style={{
                        zIndex: 0,
                        position: "absolute",
                        left: 10 + 2 * CircleSpacing,
                      }}
                    >
                      <UserAvatar
                        size={CircleSize}
                        name={usersInGroup[2]}
                        bgColor={colorArray[2]}
                      />
                    </View>
                  )}
                  {numMembers >= 99 && (
                    <View>
                      <AppText
                        style={{
                          color: colors.primaryText,
                          fontSize: 20,
                          textAlign: "center",
                        }}
                      >
                        {abbreviateNumber(numMembers)}
                      </AppText>
                      <AppText
                        style={{
                          color: colors.primaryText,
                          fontSize: 15,
                          textAlign: "center",
                        }}
                      >
                        Members
                      </AppText>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    numberOfLines={3}
                    adjustsFontSizeToFit
                    style={[styles.groupName, { fontSize: currentFont }]}
                    onTextLayout={(e) => {
                      const { lines } = e.nativeEvent;
                      if (lines.length > 1) {
                        setCurrentFont(currentFont - 1);
                      }
                    }}
                  >
                    {name}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Swipeable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: "bold",
    paddingTop: 9,
    textAlign: "center",
  },
  shadowView: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    backgroundColor: "#0000",
    elevation: 4,
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  circle: {
    width: CircleSize,
    height: CircleSize,
    borderRadius: CircleSize / 2,
    backgroundColor: "red",
  },
  card: {
    // marginTop: 15,
    width: "100%",
    // maxHeight:400,
    minHeight: 81,
    overflow: "hidden",
    marginBottom: 0,
    alignSelf: "center",
    backgroundColor: colors.fg06,
  },
  cardouter: {
    marginTop: 15,
    width: "91.5%",
    maxHeight: 400,
    minHeight: 81,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 0,
    alignSelf: "center",
    backgroundColor: colors.fg06,
    elevation: 4,
  },
  back: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    paddingRight: 10,
    display: "flex",
    flex: 0.4,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  groupName: {
    fontSize: 23,
    color: colors.AAText,
    fontWeight: "400",
    paddingRight: 15,
    // textAlign: "center",
  },
});

export default Card;
