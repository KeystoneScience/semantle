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

function Home({ navigation, route }) {
  const semantleGame = semantle();
  const [pushToken, setPushToken] = useState("");
  const [inputField, setInputField] = useState("");

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
        backgroundColor: "rgba(58, 12, 163, .01)",
        // backgroundImage: "url('https://i.imgur.com/qXZQZQJ.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
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
          height: "auto",
          backgroundColor: "rgba(58, 12, 163, .1)",
          // backgroundColor: "rgba(0,0,0,0)",
        }}
      >
        <GuessListHeader />
        <ScrollView>
          <BlurView tint="light" intensity={30}>
            {semantleGame.guesses.map((obj, index) => (
              <GuessList key={index} {...obj} />
            ))}
          </BlurView>
        </ScrollView>
        <View
          style={{
            flex: 1,
            backgroundColor: "red",
            width: "100%",
            height: 500,
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
