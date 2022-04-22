import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import LottieView from "lottie-react-native";
import colors from "../configs/colors";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import i18n from "i18n-js";
import translate from "../configs/translate";
/**
 * A slide can be created with the following properties:
 * @param {string} title - The title of the slide
 * @param {string} text - The text of the slide
 * @param {string} backgroundColor - The background color of the slide
 * @param {string} animation - The animation to be played on the slide
 * @param {string} image - The image to be displayed on the slide
 * @param {boolean} loop - Whether the animation should loop or not
 *
 */

const slides = [
  {
    key: 1,
    title: "Welcome to Semantle",
    text: i18n.t("The context-based word puzzle game"),
    animation: require("../../assets/animations/FindAWord.json"),
    loop: true,
    backgroundColor: colors.lightenColor(
      colors.colors.grooveColorPallet[2],
      30
    ),
  },
  {
    key: 2,
    title: "How to play",
    text: i18n.t(
      "Enter a word and receive how similar it is to the daily word Similarity is determined by context not by spelling"
    ),
    text2: i18n.t("Can you find the word"),
    animation: require("../../assets/animations/thinking.json"),
    loop: true,
    backgroundColor: colors.lightenColor(
      colors.colors.grooveColorPallet[4],
      30
    ),
  },
  {
    key: 3,
    title: "Play with the community",
    text: "Playing Semantle with your friends is a great experience. You can also engage with the Reddit and Discord communities!",
    backgroundColor: colors.lightenColor(
      colors.colors.grooveColorPallet[6],
      30
    ),
    animation: require("../../assets/animations/group.json"),
    loop: true,
  },
];

function WalkthroughScreen({ navigation, route }) {
  _renderItem = ({ item }) => {
    return (
      <Screen
        style={{
          backgroundColor: item.backgroundColor,
          width: "100%",
          height: "100%",
        }}
      >
        <AppText style={styles.title}>{item.title}</AppText>
        <View style={styles.MainContainer}>
          {item.animation && (
            <LottieView
              style={{
                width: "80%",
              }}
              autoPlay={true}
              resizeMode="cover"
              loop={item.loop}
              source={item.animation}
            />
          )}
          {item.image && (
            <Image
              style={{ height: "50%", resizeMode: "contain" }}
              source={item.image}
            />
          )}
          <AppText fontWeight={600} style={styles.text}>
            {item.text}
          </AppText>
          {item.text2 && (
            <AppText fontWeight={600} style={styles.text2}>
              {item.text2}
            </AppText>
          )}
        </View>
      </Screen>
    );
  };
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    const loginToken = route.params ? route.params.firstTimeLoginInfo : false;
    //firstTimeLoginInfo
    if (!loginToken) {
      navigation.navigate("Home");
    }
  };
  return (
    <AppIntroSlider
      renderItem={this._renderItem}
      data={slides}
      onDone={this._onDone}
    />
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
  },
  text: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
    padding: 20,
    fontSize: 22,
    lineHeight: 33,
  },
  text2: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.8)",
    padding: 20,
    paddingTop: 2,
    fontSize: 22,
    lineHeight: 33,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default WalkthroughScreen;
