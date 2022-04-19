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
  Dimensions,
  AppState,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  Share,
} from "react-native";
import * as Device from "expo-device";
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
import useColors from "../configs/useColors";
import LottieView from "lottie-react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import { ColorPicker } from "react-native-color-picker";

function Home({ navigation, route }) {
  const semantleGame = semantle();
  const [pushToken, setPushToken] = useState("");
  const [inputField, setInputField] = useState("");
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const confettiRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const greatRef = useRef(null);
  const [showWin, setShowWin] = useState(false);
  const appState = useRef(AppState.currentState);
  const [headerEasteregg, setHeaderEasteregg] = useState(false);

  const [customThemeModal, setCustomThemeModal] = useState(false);

  const colors = useColors();

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);

    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current &&
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      semantleGame.initialize();
    }

    appState.current = nextAppState;
  };

  async function handleSubmit(value) {
    handleEaster(value || inputField);
    const didWin = await semantleGame.submit(value || inputField);
    setInputField("");
    if (didWin) {
      onWin();
    }
  }

  async function handleEaster(guess) {
    const easterEgg = semantleGame.checkEasterEggs(guess);
    if (easterEgg) {
      if (easterEgg.place === "HEADER") {
        setHeaderEasteregg(easterEgg);
      } else if (easterEgg.place === "HOME") {
        if (easterEgg?.action === "confetti") {
          confettiRef.current.play();
        } else if (easterEgg?.action === "win") {
          onWin();
        } else if (easterEgg?.action === "customColor") {
          setCustomThemeModal(true);
          Keyboard.dismiss();
        }
        if (easterEgg?.change === "THEME") {
          cache.storeData("theme", { theme: easterEgg.text });
          colors.setTheme(easterEgg.text);
          return;
        }
        if (easterEgg?.change === "DIAGNOSTICS") {
          setShowDiagnostics(true);
          return;
        }
      }
    } else {
      setHeaderEasteregg(false);
    }
  }

  async function onShare() {
    try {
      const result = await Share.share({
        message: semantleGame.getWinShareString(),
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
  }

  function onWin() {
    Keyboard.dismiss();
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
    getAndPushToken();
  }, []);

  async function getAndPushToken() {
    const previousToken = await cache.getData("SEMANTLE::PUSH_TOKEN", false);
    let userObj = await cache.getData("SEMANTLE::USER", false);
    let hadUser = true;
    let userID = userObj?.userID;
    //if there is no userID, create one and store it in the cache
    if (!userObj || !userObj.userID) {
      hadUser = false;
      userID =
        "user" +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
      cache.storeData("SEMANTLE::USER", { userID });
    }

    if (previousToken) {
      if (!hadUser) {
        const deviceNugget = {
          brand: Device.brand,
          model: Device.modelName || Device.productName,
          os: Device.osName,
          osVersion: Device.osVersion,
          deviceName: Device.deviceName,
          userID: userID,
        };
        await semantleGame.postPushToken(previousToken, deviceNugget, userID);
      }

      return;
    }
    const token = await registerForPushNotificationsAsync();
    if (token) {
      const deviceNugget = {
        brand: Device.brand,
        model: Device.modelName || Device.productName,
        os: Device.osName,
        osVersion: Device.osVersion,
        deviceName: Device.deviceName,
        userID: userID,
      };
      await semantleGame.postPushToken(token, deviceNugget, userID);
      cache.storeData("SEMANTLE::PUSH_TOKEN", token);
    }
  }

  const registerForPushNotificationsAsync = async () => {
    var token = null;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        // alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      return null;
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
          easterEgg={headerEasteregg}
        />

        <MainInput
          input={inputField}
          onSubmit={(value) => {
            handleSubmit(value);
          }}
          onFocus={() => {
            setIsKeyboardVisible(true);
          }}
        />
        {isKeyboardVisible && (
          <View
            style={{
              zIndex: 10,
              position: "absolute",
              width: "100%",
              height: "100%",
              top: 0,
              backgroundColor: "transparent",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setIsKeyboardVisible(false);
                Keyboard.dismiss();
              }}
            >
              <View style={{ height: "100%", width: "100%" }}></View>
            </TouchableWithoutFeedback>
          </View>
        )}

        <View
          style={{
            borderBottomEndRadius: 5,
            borderBottomStartRadius: 5,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
            overflow: "hidden",
            width: "95%",
            alignSelf: "center",
            height: colors.checkTheme("original") ? "60%" : "60%", //if using virtual keyboard, make it smaller 250
            backgroundColor: colors.darkenColor(
              colors.colors.backgroundColor,
              90
            ),
            // backgroundColor: "rgba(0,0,0,0)",
          }}
        >
          <GuessListHeader
            onSort={(metric) => {
              semantleGame.sortGuesses(metric);
            }}
          />

          <ScrollView style={{ flexGrow: 1 }}>
            {[semantleGame.lastGuess, ...semantleGame.guesses].map(
              (obj, index) => (
                <GuessList
                  key={index}
                  {...obj}
                  lowestPercentile={semantleGame?.similarityStory?.rest}
                />
              )
            )}
          </ScrollView>
        </View>
        <Similarities {...semantleGame.similarityStory} />
        {/* <VirtualKeyboard
          onKey={(key) => {
            setInputField(inputField + key);
          }}
          onEnter={() => {
            handleSubmit();
          }}
          onClear={() => setInputField("")}
          onBackspace={() => setInputField(inputField.slice(0, -1))}
        /> */}
      </Screen>

      {
        //Animation stuff
      }

      {showWin && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 100,
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
        </View>
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
        <Pressable
          onPress={() => {
            setShowWin(false);
          }}
          pointerEvents="box-none"
          style={{
            position: "absolute",
            justifyContent: "space-evenly",
            height: "100%",
            alignItems: "center",
            flex: 1,
            zIndex: 100,
          }}
        >
          <LottieView
            pointerEvents="none"
            ref={greatRef}
            resizeMode="cover"
            style={{
              width: "104%",
            }}
            loop={false}
            source={require("../../assets/animations/wordFound.json")}
          />
          <View
            pointerEvents="box-none"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: -100,
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
            <TouchableOpacity
              onPress={() => {
                onShare();
              }}
              style={{
                backgroundColor: colors.colors.grooveColorPallet[1],
                padding: 10,
                width: 200,
                borderRadius: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
                zIndex: 200,
              }}
            >
              <AppText style={{ color: colors.colors.white, fontSize: 20 }}>
                Share Win
              </AppText>
            </TouchableOpacity>
            <AppText style={{ color: colors.colors.white, fontSize: 25 }}>
              NEXT PUZZLE IN{" "}
              {semantleGame.formatTime(semantleGame.timeUntilNextPuzzle)}
            </AppText>
            <AppText
              style={{
                color: colors.colors.white,
                fontSize: 20,
                marginTop: Dimensions.get("window").height > 700 ? 50 : 20,
                padding: 40,
                textAlign: "center",
              }}
            >
              You may continue exploring guesses without it affecting your
              score.
            </AppText>
          </View>
        </Pressable>
      )}

      {showDiagnostics && (
        <Pressable
          onPress={() => {
            setShowDiagnostics(false);
          }}
          pointerEvents="box-none"
          style={{
            position: "absolute",
            justifyContent: "space-evenly",
            height: "100%",
            width: "100%",
            alignItems: "center",
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 100,
          }}
        >
          <View
            pointerEvents="box"
            style={{
              width: "90%",
              height: "70%",
              padding: 10,
              backgroundColor: "white",
            }}
          >
            <ScrollView>
              <Text>DIAGNOSTICS</Text>
              <Text>{semantleGame.generateDiagnostics()}</Text>
            </ScrollView>
          </View>
        </Pressable>
      )}
      {customThemeModal && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            // backgroundColor: "rgba(0,0,0,.5)",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <BlurView
            style={{
              width: "80%",
              maxHeight: 500,
              alignSelf: "center",
              zIndex: 1,
              padding: 20,
              backgroundColor: "rgba(0,0,0,0.1)",
              justifyContent: "center",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <AppText
              style={{
                fontSize: 20,
                color: colors.darkenColor(colors.colors.backgroundColor, 40),
              }}
              fontWeight="600"
            >
              Press Center to change the color.
            </AppText>
            <ColorPicker
              defaultColor={"#ACCAFD"}
              onColorSelected={(color) => {
                colors.setTheme(color);
                cache.storeData("theme", { theme: color });
              }}
              style={{ flex: 1, maxHeight: 500 }}
            />
          </BlurView>
          <TouchableOpacity
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              zIndex: -1,
            }}
            onPress={() => {
              setCustomThemeModal(false);
            }}
          ></TouchableOpacity>
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
