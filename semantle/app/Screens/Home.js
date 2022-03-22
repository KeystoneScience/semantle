import React, { useRef, useState, useEffect } from "react";
import MainInput from "../components/MainInput";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ImageBackground,
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

function Home({ navigation, route }) {
  const semantleGame = semantle();
  const [pushToken, setPushToken] = useState("");
  const [inputField, setInputField] = useState("");

  useEffect(() => {
    semantleGame.initialize();
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
      <Header navigation={navigation} route={route} />

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
          semantleGame.submit(inputField, "test");
          setInputField("");
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
            {semantleGame.guesses.map((obj, index) => (
              <GuessList key={index} {...obj} />
            ))}

            {/* <GuessList similarity={1} percentile={1000} />
            <GuessList similarity={0.6} percentile={999} />
            <GuessList similarity={0.5} percentile={989} />
            <GuessList similarity={0.4} percentile={979} />
            <GuessList similarity={0.4} percentile={969} />
            <GuessList similarity={0.3} percentile={949} />
            <GuessList similarity={0.4} percentile={899} />
            <GuessList similarity={0.4} percentile={799} />
            <GuessList similarity={0.4} percentile={699} />
            <GuessList similarity={0.4} percentile={599} />
            <GuessList similarity={0.4} percentile={499} />
            <GuessList similarity={0.4} percentile={399} />
            <GuessList similarity={0.3} percentile={299} />
            <GuessList similarity={0.4} percentile={199} />
            <GuessList similarity={0.4} percentile={99} />
            <GuessList similarity={0.1} percentile={0} /> */}

            {/* <View style={{ height: 500 }} /> */}
          </ScrollView>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "red",
            width: "100%",
            height: 200,
          }}
        >
          <PagerView
            style={{ flex: 1 }}
            initialPage={1}
            showPageIndicator={true}
          >
            <View style={styles.page} key="1">
              <Text>First page</Text>
              <Text>Swipe ➡️</Text>
            </View>
            <View style={styles.page} key="2">
              <Text>Second page</Text>
            </View>
            <View style={styles.page} key="3">
              <Text>Third page</Text>
            </View>
          </PagerView>
        </View>
      </View>
      <Similarities {...semantleGame.similarityStory} />

      <VirtualKeyboard
        onKey={(key) => setInputField(inputField + key)}
        onEnter={() => {
          semantleGame.submit(inputField, "test");
          setInputField("");
        }}
        onClear={() => setInputField("")}
        onBackspace={() => setInputField(inputField.slice(0, -1))}
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
