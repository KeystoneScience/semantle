import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, ImageBackground, Text } from "react-native";
import UserAvatar from "react-native-user-avatar";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import i18n from "i18n-js";
import translate from "../../config/translate";
import ProgressCircle from "react-native-progress-circle";
import { AnimatedCircularProgress } from "react-native-circular-progress";
var colorArray = ["#73B758", "#7C57E0", "#BC3A37", "#5A89F8", "#D88645"].sort(
  () => Math.random() - 0.5
);
const CircleSize = 35;
const CircleSpacing = 28;
//const startingIndex = Math.floor(Math.random() * 10);
// import AvatarIcon from "./avatar";

// "adult": false,
// "backdrop_path": "/tHjoTxM4SMgazi3Y2X8mmAtONVL.jpg",
// "created": 1616449859996,
// "dislikes": 0,
// "genre_ids": Array [
//   10751,
//   12,
//   35,
//   14,
// ],
// "groupID": "0c7ff803-00be-42e0-819f-34d069d09d54",
// "id": 621876,
// "indifferents": 0,
// "likes": 5,
// "modified": 1616456799721,
// "order": "000000",
// "original_language": "en",
// "original_title": "Flora & Ulysses",
// "overview": "When Flora rescues a squirrel she names Ulysses, she is amazed to discover he possesses unique superhero powers, which take them on an adventure of humorous complications that ultimately change Flora's life--and her outlook--forever.",
// "popularity": 497.462,
// "poster_path": "/syobJCxZcIJl0OpjNroZSQKa1kW.jpg",
// "release_date": "2021-02-19",
// "superlikes": 0,
// "title": "Flora & Ulysses",
// "video": false,
// "vote_average": 6.7,
// "vote_count": 105,

function Card({
  title,
  name,
  onPress,
  onLongPress,
  poster_path,
  release_date,
  vote_average,
  rank,
  numMembers = 0,
  superlikes,
  dislikes,
  likes,
}) {
  const [currentFont, setCurrentFont] = useState(20);
  const [groupScore, setGroupScore] = useState(66);
  function pressButton() {
    onPress();
  }

  useEffect(() => {
    const groupRank = Math.floor(
      ((likes - dislikes + 1.2 * superlikes) / numMembers) * 100
    );
    if (groupRank < 0) {
      setGroupScore(0);
      return;
    }
    setGroupScore(groupRank);
  }, []);

  let gradient = [];
  if (rank == 0) {
    gradient = ["#BF953F", "#FCF6BA", "#B38728"];
  }
  if (rank == 1) {
    gradient = ["#757f9a", "#d7dde8", "#757f9a"];
  }
  if (rank == 2) {
    gradient = [
      "#804A00",
      "#895E1A",
      "#9C7A3C",
      "#B08D57",
      "#9C7A3C",
      "#895E1A",
      "#804A00",
    ];
  }
  return (
    <View style={styles.shadowView}>
      <TouchableOpacity
        delayPressIn={0}
        onPress={() => pressButton()}
        onLongPress={onLongPress}
        style={styles.card}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.back}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: "https://image.tmdb.org/t/p/w154" + poster_path,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                height: "100%",
                paddingTop: 10,
                paddingLeft: 6,
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                style={[styles.DealName, { fontSize: currentFont }]}
                onTextLayout={(e) => {
                  const { lines } = e.nativeEvent;
                  if (lines.length > 1) {
                    setCurrentFont(currentFont - 1);
                  }
                }}
              >
                {title || name}
              </Text>
              <AppText
                style={{
                  fontSize: 10,
                  color: colors.AAAText,
                  marginTop: 3,
                  marginBottom: 1,
                }}
              >
                {release_date ? release_date.substring(0, 4) : ""}
              </AppText>
              <AppText style={{ fontSize: 10, color: colors.AAAText }}>
                {i18n.t("AudienceScore")}: {vote_average}
              </AppText>
            </View>
          </View>
          {rank < 3 && (
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              style={{
                width: 25,
                height: "100%",
                position: "absolute",
                right: 0,
              }}
            />
          )}
          {numMembers > 0 && (
            <View style={{ position: "absolute", right: 25, bottom: 0 }}>
              <View style={{ width: 75, height: 50, alignItems: "center", opacity:.95 }}>
                <AnimatedCircularProgress
                  lineCap="round"
                  size={30}
                  width={3}
                  fill={groupScore}
                  backgroundWidth={2.5}
                  tintColor={
                    groupScore < 50
                      ? colors.red
                      : groupScore < 75
                      ? colors.yellow
                      : groupScore <= 100
                      ? colors.greenHeart
                      : colors.primary
                  }
                  backgroundColor={colors.fg04}
                >
                  {(fill) => (
                    <Text
                      style={{
                        fontWeight: "500",
                        fontSize: 8,
                        color: colors.AAText,
                      }}
                    >
                      {groupScore + "%"}
                    </Text>
                  )}
                </AnimatedCircularProgress>
                <Text
                  style={{
                    fontSize: 7,
                    color: colors.AAAText,
                    textAlign: "center",
                    fontWeight: "600",
                    marginTop: 2,
                  }}
                >
                  {i18n.t("Match Score")}
                </Text>
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // avatarText: {
  //   fontSize: 12,
  //   color: colors.primaryText,
  //   fontWeight: "bold",
  //   paddingTop: 9,
  //   textAlign: "center",
  // },
  shadowView: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  circle: {
    width: CircleSize,
    height: CircleSize,
    borderRadius: CircleSize / 2,
    backgroundColor: colors.grey,
  },
  card: {
    marginTop: 5,
    width: "91.5%",
    // maxHeight:400,
    minHeight: 100,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 5,
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
  dealContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 1 },
    backgroundColor: "#0000",
    elevation: 4,
  },
  logoContainer: {
    flex: 0.24,
    marginLeft: -6.8,
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
  },
  DealName: {
    fontSize: 23,
    color: colors.AAText,
    fontWeight: "500",
    textAlign: "left",
    paddingRight: 26,
  },
});

export default Card;
