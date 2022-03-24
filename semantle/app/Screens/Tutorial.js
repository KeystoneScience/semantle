import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import LottieView from "lottie-react-native";
import colors from "../configs/colors";
import AppText from "../components/AppText";

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
    text: "The context-based word puzzle",
    image: null,
    backgroundColor: colors.lightenColor(
      colors.colors.grooveColorPallet[2],
      30
    ),
  },
  {
    key: 2,
    title: "",
    text: "",
    backgroundColor: colors.lightenColor(
      colors.colors.grooveColorPallet[4],
      30
    ),
    animation: null,
    loop: true,
  },
  {
    key: 3,
    title: "",
    text: "Coupons can be redeemed, or traded with other users.",
    backgroundColor: colors.lightenColor(
      colors.colors.grooveColorPallet[6],
      30
    ),
    animation: null,
    loop: true,
  },
];

function WalkthroughScreen({ navigation, route }) {
  _renderItem = ({ item }) => {
    return (
      <View
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
          <AppText style={styles.text}>{item.text}</AppText>
        </View>
      </View>
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
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  text: {
    textAlign: "center",
    color: "#fff",
    padding: 20,
    fontSize: 20,
    lineHeight: 30,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default WalkthroughScreen;
