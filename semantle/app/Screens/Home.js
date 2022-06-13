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
  Alert,
  Share,
  Modal,
  Linking,
  StatusBar,
} from "react-native";
import Toast from "react-native-toast-message";

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
import * as StoreReview from "expo-store-review";
import useColors from "../configs/useColors";
import LottieView from "lottie-react-native";
import Screen from "../components/Screen";
import AppText from "../components/AppText";
import { ColorPicker } from "react-native-color-picker";
import i18n from "i18n-js";
import AnimatedText from "../components/AnimatedText";
import translate from "../configs/translate";
import Tooltip from "react-native-walkthrough-tooltip";

function Home({ navigation, route }) {
  const semantleGame = semantle();
  const [inputField, setInputField] = useState("");
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const confettiRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isStatsVisible, setIsStatsVisible] = useState(true);
  const [showWin, setShowWin] = useState(false);
  const appState = useRef(AppState.currentState);
  const [headerEasteregg, setHeaderEasteregg] = useState(false);

  const [customThemeModal, setCustomThemeModal] = useState(false);

  const colors = useColors();

  const [tooltips, setTooltips] = useState(0);

  function tutorial() {
    setTooltips(tooltips + 1);
    if (tooltips == 3) {
      // console.log("tooltips", tooltips);
      confettiRef.current.play();
      setTooltips(0);
    }
  }

  async function displayToast() {
    //the current time
    const currentTime = new Date().getTime();
    //the time when the user last rated the app
    const lastDisplay = await cache.getData("lastPIFTime", false);
    //if the last prompt was more than 2 weeks ago
    const names = [
      "Susan",
      "Michelle",
      "The Stones",
      "Jackson",
      "Lisa",
      "Elizabeth",
    ];
    //get a random name
    const randomName = names[Math.floor(Math.random() * 10000) % names.length];

    if (!lastDisplay || currentTime - lastDisplay.time > 3600000) {
      Toast.show({
        type: "info",
        text1: "Pay it forward",
        text2: `❤️ Semantle is made free to you by ${randomName}`,
      });
      cache.storeData("lastPIFTime", {
        time: currentTime,
      });
    }
  }

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
        } else if (easterEgg?.action === "hideStats") {
          setIsStatsVisible(false);
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
      } else if (easterEgg.place === "NAVIGATE") {
        navigation.navigate(easterEgg.location);
      }
    } else {
      setHeaderEasteregg(false);
    }
  }

  async function onShare() {
    try {
      const result = await Share.share({
        message: semantleGame.getWinShareString(),
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

  async function mayRequestRating() {
    //the current time
    const currentTime = new Date().getTime();
    //the time when the user last rated the app
    const lastRatingObj = await cache.getData("lastRatingTime", false);
    //if the last prompt was more than 2 weeks ago
    if (!lastRatingObj || currentTime - lastRatingObj.time > 1209600000) {
      //prompt the user to rate the app
      if (await StoreReview.hasAction()) {
        StoreReview.requestReview();
        cache.storeData("lastRatingTime", {
          time: currentTime,
        });
      }
    }
  }

  function onWin() {
    Keyboard.dismiss();
    setShowWin(true);

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
    // displayToast();
  }, []);
  useEffect(() => {
    if (route?.params?.isFromTutorial) {
      setTimeout(() => {
        setTooltips(1);
        route.params.isFromTutorial = false;
      }, 500);
    }
  }, [route?.params?.isFromTutorial]);

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
        <Tooltip
          isVisible={tooltips === 1}
          closeOnContentInteraction={true}
          closeOnChildInteraction={false}
          backgroundColor="rgba(0,0,0,.2)"
          childrenWrapperStyle={{
            borderRadius: 10,
            overflow: "hidden",
            borderWidth: 3,
            // paddingBottom: -10,
            borderColor: colors.colors.grooveColorPallet[1],
          }}
          disableShadow={true}
          contentStyle={{
            backgroundColor: colors.colors.grooveColorPallet[0],
            overflow: "visible",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            elevation: 3,

            width: "100%",
            height: "100%",
          }}
          content={
            <View>
              <AppText
                fontWeight={"800"}
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,.8)",
                }}
              >
                Enter your guesses here!
              </AppText>
              <AppText
                fontWeight={"500"}
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,.6)",
                  textAlign: "center",
                }}
              >
                (enter word to continue)
              </AppText>
            </View>
          }
          onClose={() => {}}
          placement="bottom"
          // below is for the status bar of react navigation bar
          topAdjustment={
            Platform.OS === "android" ? -StatusBar.currentHeight : 0
          }
        >
          <MainInput
            input={inputField}
            onSubmit={(value) => {
              handleSubmit(value);
              if (tooltips === 1) {
                setTooltips(2);
              }
            }}
            onFocus={() => {
              setIsKeyboardVisible(true);
            }}
          />
        </Tooltip>
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
            height: isStatsVisible ? "60%" : "80%", //if using virtual keyboard, make it smaller 250
            backgroundColor: colors.darkenColor(
              colors.colors.backgroundColor,
              90
            ),
            // backgroundColor: "rgba(0,0,0,0)",
          }}
        >
          <Tooltip
            isVisible={tooltips === 2}
            backgroundColor="rgba(0,0,0,.2)"
            closeOnChildInteraction={true}
            closeOnContentInteraction={true}
            disableShadow={true}
            contentStyle={{
              backgroundColor: colors.colors.grooveColorPallet[0],
              width: "100%",
              height: "100%",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 2,
              elevation: 3,
            }}
            tooltipStyle={{
              marginTop: 60,
            }}
            content={
              <View>
                <AppText
                  fontWeight={"800"}
                  style={{
                    fontSize: 18,
                    color: "rgba(255,255,255,.8)",
                    lineHeight: 30,
                    alignSelf: "center",
                    marginBottom: 10,
                  }}
                >
                  Get info on your guesses here!
                </AppText>

                <AppText
                  fontWeight={"500"}
                  style={{
                    fontSize: 18,
                    color: "rgba(255,255,255,.8)",
                    lineHeight: 30,
                    marginBottom: 10,
                  }}
                >
                  <AppText fontWeight={"800"}>Similarity:</AppText>{" "}
                  {i18n.t("how alike your guess is to the secret word")}
                </AppText>

                <AppText
                  fontWeight={"500"}
                  style={{
                    fontSize: 18,
                    color: "rgba(255,255,255,.8)",
                    lineHeight: 30,
                  }}
                >
                  <AppText fontWeight={"800"}>Distance:</AppText>{" "}
                  {i18n.t(
                    "An indicator if your guess is in the top 1000 closest words to the secret"
                  )}
                </AppText>
              </View>
            }
            onClose={tutorial}
            placement="bottom"
            topAdjustment={
              Platform.OS === "android" ? -StatusBar.currentHeight : 0
            }
          >
            <GuessListHeader
              onSort={(metric) => {
                semantleGame.sortGuesses(metric);
              }}
            />
          </Tooltip>
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
        <Tooltip
          isVisible={tooltips === 3}
          backgroundColor="rgba(0,0,0,.2)"
          childrenWrapperStyle={{
            borderRadius: 10,
            overflow: "hidden",
            borderWidth: 3,
            paddingBottom: 10,
            borderColor: colors.colors.grooveColorPallet[1],
            backgroundColor: colors.colors.backgroundColor,
          }}
          closeOnChildInteraction={true}
          disableShadow={true}
          contentStyle={{
            backgroundColor: colors.colors.grooveColorPallet[0],
            width: "100%",
            height: "100%",
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 2,
            elevation: 3,
          }}
          content={
            <View>
              <AppText
                fontWeight={"600"}
                style={{
                  fontSize: 18,
                  color: "rgba(255,255,255,.8)",
                  lineHeight: 30,
                }}
              >
                How similar the 1st, 10th, and 1000th closest words are to the
                secret
              </AppText>
            </View>
          }
          onClose={tutorial}
          placement="top"
          // arrowStyle={{
          //   marginLeft: 10,
          // }}
          // below is for the status bar of react navigation bar
          topAdjustment={
            Platform.OS === "android" ? -StatusBar.currentHeight : 0
          }
        >
          {isStatsVisible && <Similarities {...semantleGame.similarityStory} />}
        </Tooltip>
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
            mayRequestRating();
          }}
          pointerEvents="box-none"
          style={{
            position: "absolute",
            justifyContent: "space-evenly",
            height: "100%",
            width: "100%",
            alignItems: "center",
            flex: 1,
            zIndex: 100,
          }}
        >
          <View
            style={{
              width: "100%",
              height: 300,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <AnimatedText
              fontSize={90}
              height={150}
              scale={"GREAT!"}
              color={colors.colors.grooveColorPallet[2]}
            >
              {i18n.t("GREAT!")}
            </AnimatedText>
          </View>

          <View
            pointerEvents="box-none"
            style={{
              display: "flex",
              width: "100%",

              justifyContent: "center",
              alignItems: "center",
              marginTop: -100,
            }}
          >
            <AppText
              style={{
                color: colors.colors.white,
                fontSize: 30,
                textTransform: "uppercase",
                textAlign: "center",
                marginHorizontal: 10,
              }}
            >
              🔥
              {" " + semantleGame.streak + " "}
              {i18n.t("Day Streak")}
            </AppText>
            <AppText
              style={{
                color: colors.colors.white,
                fontSize: 25,
                textTransform: "uppercase",
                textAlign: "center",
                marginHorizontal: 10,
              }}
            >
              {i18n.t("Word found in")} {semantleGame.guesses.length}{" "}
              {i18n.t("guesses")}
            </AppText>
            <TouchableOpacity
              onPress={() => {
                onShare();
              }}
              style={{
                backgroundColor: colors.colors.grooveColorPallet[1],
                padding: 5,
                paddingHorizontal: 40,
                borderRadius: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: 10,
                zIndex: 200,
              }}
            >
              <AppText style={{ color: colors.colors.white, fontSize: 24 }}>
                Share Win
              </AppText>
            </TouchableOpacity>
            <AppText
              style={{
                color: colors.colors.white,
                fontSize: 25,
                textTransform: "uppercase",
                textAlign: "center",
                marginHorizontal: 10,
              }}
            >
              {i18n.t("Next puzzle In")}{" "}
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
              You may continue exploring guesses without it affecting your score
            </AppText>
          </View>
        </Pressable>
      )}

      {showDiagnostics && (
        <View
          onPress={() => {
            setShowDiagnostics(false);
          }}
          pointerEvents="box-none"
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            zIndex: 100,
          }}
        >
          <Pressable
            onPress={() => {
              setShowDiagnostics(false);
            }}
            style={{
              position: "absolute",
              justifyContent: "space-evenly",
              height: "100%",
              width: "100%",
              alignItems: "center",
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          />

          <View
            style={{
              width: "90%",
              height: "70%",
              padding: 10,
              backgroundColor: "white",
            }}
          >
            {/* <AntDesign
              name="copy1"
              size={24}
              color="black"
              onPress={() => {
                Clipboard.setString(semantleGame.generateDiagnostics());
                Alert.alert("Copied to clipboard");
              }}
            /> */}
            <ScrollView>
              <Text>DIAGNOSTICS</Text>
              <Text>{semantleGame.generateDiagnostics()}</Text>
            </ScrollView>
          </View>
        </View>
      )}
      {customThemeModal && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={customThemeModal}
          onRequestClose={() => {
            setModalVisible(!customThemeModal);
          }}
        >
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
                zIndex: 100,
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
                Press the center to change the color
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
        </Modal>
      )}
      <Toast
        onPress={() => {
          Linking.openURL("https://www.patreon.com/semantleapp");
        }}
      />
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
