import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  Share,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Foundation,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Entypo,
  Ionicons,
  EvilIcons,
} from "@expo/vector-icons";

import Constants from "expo-constants";
import Screen from "./Screen";
import Accordian from "./Accordion";
import useColors from "../configs/useColors";
import AppText from "./AppText";

function Drawer({ navigation, route }) {
  const colors = useColors();

  const semantleGame = route.params.semantleGame;
  const [totalGames, setTotalGames] = useState(0);
  const [nearbyModal, setNearbyModal] = useState(false);
  const [averageGuesses, setAverageGuesses] = useState("∞");

  async function updateStats() {
    const stats = await semantleGame.getStats();
    let wins = 0;
    let guesses = 0;

    for (var i in stats) {
      if (stats[i].found) {
        wins++;
        guesses += stats[i].numberOfGuesses;
      }
    }
    setAverageGuesses(wins == 0 ? "∞" : Math.round((guesses / wins) * 10) / 10);
    setTotalGames(wins);
  }

  function formatTime(time) {
    //convert time in millis to hours, minutes, seconds
    var hours = Math.floor(time / 3600000);
    var minutes = Math.floor((time % 3600000) / 60000);
    var seconds = Math.floor((time % 60000) / 1000);
    return `${hours}h ${minutes}m`;
  }

  const styles = StyleSheet.create({
    bottomwhole: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      backgroundColor: colors.lightenColor(colors.colors.backgroundColor, 60),
      borderBottomEndRadius: 10,
    },
    leftWhole: {
      width: "80%",
      height: "100%",
      backgroundColor: colors.lightenColor(colors.colors.backgroundColor, 40),
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    },
    rightWhole: {
      flex: 1,
      // backgroundColor: "rgba(0, 0, 0, .2)",
    },
    tutorialwhole: {
      backgroundColor: "rgba(255,255,255,.3)",
      height: 70,
      width: "80%",
      alignSelf: "center",
      marginBottom: 20,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    tutorialText: {
      paddingHorizontal: 15,
      fontSize: 20,
      paddingTop: 7,
      color: colors.darkenColor(colors.colors.backgroundColor, 30),
    },
  });

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: "Download Semantle",
        url: "https://www.semantle.app/download",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        //pressButton();
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //every time the drawer is opened, run a useEffect to update the streak
  useEffect(() => {
    updateStats();
  }, []);
  const fontSizeofYesterdaysWord =
    semantleGame.getYesterdaysWord().length <= 8
      ? 50
      : 50 - Math.floor(semantleGame.getYesterdaysWord().length);
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={styles.leftWhole}>
        <SafeAreaView
          style={{
            paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight / 2,
          }}
        >
          <ScrollView>
            <View
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                paddingBottom: 300,
              }}
            >
              <View style={{ marginTop: 20 }}>
                <AppText style={{ fontSize: 16 }}>
                  Next word in:{" "}
                  {formatTime(semantleGame.getTimeUntilNextPuzzle())}
                </AppText>
              </View>
              {semantleGame.streak > 0 && (
                <View
                  style={{
                    backgroundColor: colors.colors.lightGray,
                    marginTop: 25,
                    width: "80%",
                    borderRadius: 10,
                    aspectRatio: 1.5,
                    display: "flex",
                    padding: 0,
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <Text style={{ fontSize: 90 }}>🔥</Text>
                  <AppText style={{ fontSize: 20 }}>
                    {semantleGame.streak} DAY STREAK
                  </AppText>
                </View>
              )}
              <TouchableOpacity
                style={{
                  backgroundColor: colors.colors.lightGray,
                  marginTop: 25,
                  width: "80%",
                  borderRadius: 10,
                  aspectRatio: 1.5,
                  display: "flex",
                  padding: 0,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
                onPress={() => {
                  setNearbyModal(true);
                }}
              >
                <AppText
                  style={{
                    fontSize: fontSizeofYesterdaysWord,
                    height: 70,
                    color: colors.colors.grooveColorPallet[3],
                  }}
                >
                  {semantleGame.getYesterdaysWord()}
                </AppText>
                <AppText style={{ fontSize: 20 }}>YESTERDAY'S WORD</AppText>
                <AppText style={{ fontSize: 16 }}>
                  (click for similar words)
                </AppText>
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: colors.colors.lightGray,
                  marginTop: 25,
                  width: "80%",
                  borderRadius: 10,
                  aspectRatio: 1.5,
                  display: "flex",
                  padding: 0,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "70%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "40%",
                    }}
                  >
                    <AppText style={{ fontSize: 50, height: 70 }}>
                      {totalGames}
                    </AppText>
                    <AppText>
                      {totalGames == 1 ? "GAME SOLVED" : "GAMES SOLVED"}
                    </AppText>
                  </View>
                  <View
                    style={{
                      height: "80%",
                      borderColor: colors.colors.black,
                      borderWidth: 1,
                      margin: 5,
                    }}
                  />
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "40%",
                    }}
                  >
                    <AppText style={{ fontSize: 50, height: 70 }}>
                      {averageGuesses}
                    </AppText>
                    <AppText style={{ textAlign: "center" }}>
                      AVG GUESSES
                    </AppText>
                  </View>
                </View>
                <AppText style={{ fontSize: 20 }}>🧪 STATS</AppText>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
        <SafeAreaView style={styles.bottomwhole}>
          <View
            style={{
              justifyContent: "space-around",
              flexDirection: "row",
              paddingTop: 20,
            }}
          >
            {/* <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://www.facebook.com/FlixPix-113664830823363"
                  )
                }
              >
                <View
                  style={{
                    backgroundColor: "#1778f2",
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome
                    name="facebook-f"
                    size={25}
                    color={'black'}
                    style={{ alignSelf: "center" }}
                  />
                </View>
              </TouchableOpacity> */}

            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://www.reddit.com/r/Semantle/")
              }
            >
              <View
                style={{
                  backgroundColor: "#FF5700",
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  justifyContent: "center",
                }}
              >
                <FontAwesome5
                  name="reddit-alien"
                  size={25}
                  color={"white"}
                  style={{ alignSelf: "center" }}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL("https://discord.gg/Vh9dKRakv2")}
            >
              <View
                style={{
                  backgroundColor: "#7289DA",
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  justifyContent: "center",
                }}
              >
                <FontAwesome5
                  name="discord"
                  size={25}
                  color={"white"}
                  style={{ alignSelf: "center" }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onShare()}>
              <View
                style={{
                  backgroundColor: "#A0A0A0",
                  width: 50,
                  height: 50,
                  borderRadius: 50,
                  justifyContent: "center",
                }}
              >
                <EvilIcons
                  name="share-apple"
                  size={25}
                  color={"white"}
                  style={{ alignSelf: "center" }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <Accordian
            // expanded={true}
            title={"Support Semantle"}
            data={"sdfsfdsdasdfsd"}
            titleIcon={
              <AntDesign
                name="heart"
                size={22}
                color={colors.darkenColor(colors.colors.backgroundColor, 80)}
                style={{ marginRight: -36 }}
              />
            }
            children={
              <View>
                {/* <TouchableOpacity
                  onPress={() =>
                    Platform.OS === "ios"
                      ? Linking.openURL(
                          "https://itunes.apple.com/us/app/flixpix/id1561264727"
                        )
                      : Linking.openURL(
                          "https://play.google.com/store/apps/details?id=com.nateastone.FlixPix"
                        )
                  }
                >
                  <View
                    style={[
                      styles.tutorialwhole,
                      { backgroundColor: "yellow", marginTop: 15 },
                    ]}
                  >
                    <FontAwesome
                      name="star"
                      size={30}
                      color={colors.darkenColor(
                        colors.colors.backgroundColor,
                        80
                      )}
                      style={{ marginLeft: 10 }}
                    />
                    <Text style={styles.tutorialText}>Rate Semantle</Text>
                  </View>
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://semantle.app/requestfeature")
                  }
                >
                  <View
                    style={[
                      styles.tutorialwhole,
                      {
                        backgroundColor: "rgba(255,255,255,.3)",
                        marginTop: 0,
                      },
                    ]}
                  >
                    <FontAwesome5
                      name="lightbulb"
                      size={30}
                      color={colors.darkenColor(
                        colors.colors.backgroundColor,
                        80
                      )}
                      style={{ marginLeft: 10 }}
                    />
                    <AppText fontWeight={550} style={styles.tutorialText}>
                      Request Feature
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>
            }
          />
          <Accordian
            title={"Help"}
            data={"sdfsfdsdasdfsd"}
            titleIcon={
              <Entypo
                name="help"
                size={22}
                color={colors.darkenColor(colors.colors.backgroundColor, 80)}
                style={{ marginRight: "-50%" }}
              />
            }
            children={
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Tutorial")}
                >
                  <View style={styles.tutorialwhole}>
                    <Foundation
                      name="guide-dog"
                      size={44}
                      color={colors.darkenColor(
                        colors.colors.backgroundColor,
                        80
                      )}
                      style={{ marginLeft: 10 }}
                    />
                    <AppText fontWeight={550} style={styles.tutorialText}>
                      Tutorial
                    </AppText>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://semantle.app/bug-report")
                  }
                >
                  <View
                    style={[
                      styles.tutorialwhole,
                      { backgroundColor: "rgba(255,255,255,.3)" },
                    ]}
                  >
                    <Entypo
                      name="bug"
                      size={26}
                      color={colors.darkenColor(
                        colors.colors.backgroundColor,
                        80
                      )}
                      style={{ marginLeft: 10 }}
                    />
                    <AppText fontWeight={550} style={styles.tutorialText}>
                      Report Problem
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>
            }
          />
        </SafeAreaView>
      </View>
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
        <View style={styles.rightWhole}></View>
      </TouchableWithoutFeedback>
      {nearbyModal && (
        <NearbyWordsModal
          colors={colors}
          onClose={() => {
            setNearbyModal(false);
          }}
          data={semantleGame.yesterdayClosest}
        />
      )}
    </View>
  );
}

function NearbyWordsModal({ data, onClose, colors }) {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,.5)",
      }}
      onPress={onClose}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={onClose}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
        <View
          style={{
            backgroundColor: colors.colors.white,
            width: "80%",
            borderRadius: 10,
            height: "70%",
          }}
        >
          <ScrollView style={{ padding: 10, paddingBottom: 100 }}>
            <AppText
              style={{
                width: "100%",
                fontSize: 20,
                textAlign: "center",
                color: colors.colors.grooveColorPallet[2],
              }}
            >
              Yesterday's 10 closest words
            </AppText>
            <View
              style={{
                borderWidth: 1,
                marginBottom: 20,
                borderColor: colors.colors.grooveColorPallet[2],
              }}
            />
            {data.map((word, index) => (
              <AppText
                key={index}
                style={{
                  fontSize: 20,
                  marginTop: 10,
                  marginLeft: 5,
                  color:
                    colors.colors.grooveColorPallet[
                      Math.floor((5 / 9) * index + 22 / 9)
                    ],
                }}
              >
                {index + 1}. {word}
              </AppText>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
export default Drawer;
