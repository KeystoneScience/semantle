import React, { useRef, useState, useEffect } from "react";
import MainInput from "../components/MainInput";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import GuessList from "../components/GuessList";
import GuessListHeader from "../components/GuessListHeader";
import semantle from "../functions/semantle";
import Header from "../components/Header";
import cache from "../utility/cache";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import VirtualKeyboard from "../components/VirtualKeyboard";
import { BlurView } from "expo-blur";
import PagerView from "react-native-pager-view";
import Similarities from "../components/Similarities";
import colors from "../configs/colors";
import LottieView from "lottie-react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";

function Home({ navigation, route }) {
  const semantleGame = semantle();
  const [pushToken, setPushToken] = useState("");
  const [inputField, setInputField] = useState("");
  const confettiRef = useRef(null);
  const greatRef = useRef(null);
  const [showWin, setShowWin] = useState(false);

  async function handleSubmit() {
    const didWin = await semantleGame.submit(inputField);
    setInputField("");
    if (didWin) {
      onWin();
    }
  }

  function onWin() {
    setShowWin(true);
    setTimeout(() => {
      greatRef.current.play();
    }, 100);

    setTimeout(() => {
      confettiRef.current.play();
    }, 500);
  }

  async function checkFirstTime() {
    const firstTime = await cache.getData("firstTime", false);
    console.log(firstTime);
    if (firstTime) {
      return;
    }
    cache.storeData("firstTime", { firstTime: true });
    setTimeout(() => {
      navigation.navigate("Tutorial");
    }, 100);
  }

  useEffect(() => {
    semantleGame.initialize();
    checkFirstTime();
  }, []);

  async function getAndPushToken() {
    const previousToken = await cache.getData("FLIXPIX::PUSH_TOKEN", false);
    if (previousToken) {
      setPushToken(previousToken);
      return;
    }
    const token = await registerForPushNotificationsAsync();
    if (token) {
      await tokenApi.request(token);
      setPushToken(token);
      cache.storeData("FLIXPIX::PUSH_TOKEN", token);
    }
  }

  const registerForPushNotificationsAsync = async () => {
    var token = null;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return token;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          experienceId: "@nateastone/FlixPix",
        })
      ).data;
    } else {
      // console.warn("NO NOTIFICATIONS ARE SENT TO NON-PHYSICAL DEVICES!")
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  };

  return (
    <View
      style={{
        backgroundColor: colors.colors.backgroundColor,
        flex: 1,
      }}
    >
      <Screen>
        <Header
          navigation={navigation}
          route={route}
          semantleGame={semantleGame}
          timeUntilNextPuzzle={semantleGame.timeUntilNextPuzzle}
        />

        {/* <Text
          onPress={() => navigation.navigate("Drawer")}
          style={styles.title}
        >
          Semantle
        </Text> */}
        {/* <Text style={styles.subtitle}>can you guess the word?</Text> */}
        <MainInput
          input={inputField}
          onSubmit={() => {
            handleSubmit();
          }}
        />
        <View
          style={{
            borderBottomEndRadius: 5,
            borderBottomStartRadius: 5,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            overflow: "hidden",
            width: "95%",
            alignSelf: "center",

            backgroundColor: colors.darkenColor(
              colors.colors.backgroundColor,
              90
            ),
            // backgroundColor: "rgba(0,0,0,0)",
          }}
        >
          <GuessListHeader />
          <View
            style={{
              height: 200,
            }}
          >
            <ScrollView>
              {[semantleGame.lastGuess, ...semantleGame.guesses].map(
                (obj, index) => (
                  <GuessList key={index} {...obj} />
                )
              )}
            </ScrollView>
          </View>
        </View>
        <Similarities {...semantleGame.similarityStory} />

        <VirtualKeyboard
          onKey={(key) => {
            setInputField(inputField + key);
          }}
          onEnter={() => {
            handleSubmit();
          }}
          onClear={() => setInputField("")}
          onBackspace={() => setInputField(inputField.slice(0, -1))}
        />
      </Screen>
      {
        //Animation stuff
      }

      {showWin && (
        <TouchableOpacity
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 100,
          }}
          onPress={() => {
            setShowWin(false);
          }}
        >
          {Platform.OS === "ios" ? (
            <BlurView
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            ></BlurView>
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
            />
          )}
        </TouchableOpacity>
      )}

      <View
        pointerEvents="none"
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          height: "100%",
          position: "absolute",
          zIndex: 100,
        }}
      >
        <LottieView
          ref={confettiRef}
          resizeMode="cover"
          style={{
            height: "100%",
          }}
          loop={false}
          source={require("../../assets/animations/confetti.json")}
        />
      </View>
      {showWin && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            zIndex: 100,
          }}
        >
          <LottieView
            ref={greatRef}
            resizeMode="cover"
            style={{
              width: "104%",
              marginTop: 30,
            }}
            loop={false}
            source={require("../../assets/animations/wordFound.json")}
          />
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: -120,
            }}
          >
            <AppText style={{ color: colors.colors.white, fontSize: 30 }}>
              🔥
              {" " + semantleGame.streak + " "}
              DAY STREAK
            </AppText>
            <AppText style={{ color: colors.colors.white, fontSize: 25 }}>
              WORD FOUND IN {semantleGame.guesses.length} GUESSES
            </AppText>
            <AppText style={{ color: colors.colors.white, fontSize: 25 }}>
              NEXT PUZZLE IN{" "}
              {semantleGame.formatTime(semantleGame.timeUntilNextPuzzle)}
            </AppText>
            <AppText
              style={{
                color: colors.colors.white,
                fontSize: 20,
                marginTop: 50,
                padding: 40,
                textAlign: "center",
              }}
            >
              You may continue exploring guesses without it affecting your
              score.
            </AppText>
          </View>
        </View>
      )}
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
    textAlign: "center",
    marginTop: 100,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "black",
    marginBottom: 10,
    textAlign: "center",
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
