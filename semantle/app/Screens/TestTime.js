import React, { useRef, useState, useEffect } from "react";
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
  Clipboard,
  TextInput,
  Alert,
  Share,
} from "react-native";
import AppText from "../components/AppText";
import colors from "../configs/colors";
import cache from "../utility/cache";
import { AntDesign } from "@expo/vector-icons";

function TestTime({ navigation, route }) {
  const [testCache, setTestCache] = useState("");
  const [testGuessCache, setTestGuessCache] = useState("");
  const [testGuessCacheNum, setTestGuessCacheNum] = useState(0);
  const [testGuessCacheWord, setTestGuessCacheWord] = useState("");
  const [testGuessCacheWordText, setTestGuessCacheWordText] = useState("");

  async function handleTestCache() {
    let testCacheLog = "";
    //cahces: SEMANTLE::USER SEMANTLE::PUSH_TOKEN SEMANTLE_[DAY] SEMANTLE_STREAK SEMANTLE_STATS
    setTestCache("Running test...");
    let userObj = await cache.getData("SEMANTLE::USER", false);
    testCacheLog += "SEMANTLE::USER: " + JSON.stringify(userObj) + "\n";
    let pushToken = await cache.getData("SEMANTLE::PUSH_TOKEN", false);
    testCacheLog += "SEMANTLE::PUSH_TOKEN: " + JSON.stringify(pushToken) + "\n";
    let streakObj = await cache.getData("SEMANTLE_STREAK", false);
    testCacheLog += "SEMANTLE_STREAK: " + JSON.stringify(streakObj) + "\n";
    let statsObj = await cache.getData("SEMANTLE_STATS", false);
    testCacheLog += "SEMANTLE_STATS: " + JSON.stringify(statsObj) + "\n";

    setTestCache(testCacheLog);
  }

  async function handleTestGuessCache() {
    if (
      testGuessCacheNum <= 0 ||
      testGuessCacheNum != Math.floor(testGuessCacheNum)
    ) {
      setTestGuessCache("Please enter a valid input.");
      return;
    }

    let testCacheLog = `SEMANTLE_${testGuessCacheNum}: NULL`;
    //cahces: SEMANTLE::USER SEMANTLE::PUSH_TOKEN SEMANTLE_[DAY] SEMANTLE_STREAK SEMANTLE_STATS
    setTestGuessCache("Running test...");
    let guesses = await cache.getData("SEMANTLE_" + testGuessCacheNum, false);
    if (guesses) {
      testCacheLog =
        "SEMANTLE_" + testGuessCacheNum + ": " + JSON.stringify(guesses) + "\n";
    }
    setTestGuessCache(testCacheLog);
  }

  async function handleTestGuessCacheSubmit() {
    if (
      testGuessCacheNum <= 0 ||
      testGuessCacheNum != Math.floor(testGuessCacheNum) ||
      !testGuessCacheWord
    ) {
      setTestGuessCacheWordText("Please enter a valid input.");
      return;
    }
    try {
      let testCacheLog = "";
      setTestGuessCacheWordText("Running test...");
      let guesses = await cache.getData("SEMANTLE_" + testGuessCacheNum, false);
      guesses = guesses ? guesses : [];
      guesses.push({
        guess: testGuessCacheWord,
        guessCount: guesses.length - 1,
        similarity: 0,
      });
      await cache.storeData("SEMANTLE_" + testGuessCacheNum, guesses);
      testCacheLog = `Added ${testGuessCacheWord} to SEMANTLE_${testGuessCacheNum}, the new cache has ${guesses.length} items.`;
      setTestGuessCacheWordText(testCacheLog);
    } catch (e) {
      setTestGuessCacheWordText(e.message);
    }
  }

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: colors.colors.backgroundColor,
        padding: 30,
      }}
    >
      <AntDesign
        name="closecircle"
        size={24}
        style={{ margin: 10 }}
        color="black"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
      <ScrollView style={{ width: "100%", margin: 10 }}>
        <AppText
          style={{
            fontSize: 20,
            alignSelf: "center",
            color: colors.colors.textColor,
          }}
        >
          CACHE TESTS
        </AppText>
        <AppText
          style={{ fontSize: 16, width: "90%", color: colors.colors.textColor }}
        >
          GENERAL TEST:
        </AppText>
        <AntDesign
          name="copy1"
          size={24}
          color="black"
          onPress={() => {
            Clipboard.setString(testCache);
            Alert.alert("Copied to clipboard!");
          }}
        />
        <AppText style={{ width: "93%", color: colors.colors.textColor }}>
          {testCache}
        </AppText>
        <Button onPress={handleTestCache} />
        <View
          style={{
            width: "90%",
            alignSelf: "center",
            borderWidth: 1,
            marginTop: 10,
            marginBottom: 10,
          }}
        />
        <AppText
          style={{ fontSize: 16, width: "90%", color: colors.colors.textColor }}
        >
          GUESS CACHE TEST:
        </AppText>
        <AppText
          style={{ fontSize: 14, width: "90%", color: colors.colors.textColor }}
        >
          Get Cache:
        </AppText>
        <AntDesign
          name="copy1"
          size={24}
          color="black"
          onPress={() => {
            Clipboard.setString(testGuessCache);
            Alert.alert("Copied to clipboard!");
          }}
        />
        <AppText style={{ width: "93%", color: colors.colors.textColor }}>
          {testGuessCache}
        </AppText>
        <TextInput
          style={{
            width: "80%",
            fontSize: 16,
            color: colors.colors.textColor,
            margin: 9,
            padding: 5,
            borderWidth: 1,
          }}
          value={testGuessCacheNum}
          onChangeText={(text) => setTestGuessCacheNum(text)}
          onSubmitEditing={() => {
            handleTestGuessCache();
          }}
          placeholder="Enter Puzzle Number"
          returnKeyType="go"
          keyboardType="default"
          blurOnSubmit={false}
          placeholderTextColor={colors.colors.textInputColor}
        />
        <Button onPress={handleTestGuessCache} />
        <AppText
          style={{ fontSize: 14, width: "90%", color: colors.colors.textColor }}
        >
          Add Word:
        </AppText>
        <AppText
          style={{ fontSize: 14, width: "90%", color: colors.colors.textColor }}
        >
          {testGuessCacheWordText}
        </AppText>
        <TextInput
          style={{
            width: "80%",
            fontSize: 16,
            color: colors.colors.textColor,
            margin: 9,
            padding: 5,
            borderWidth: 1,
          }}
          value={testGuessCacheNum}
          onChangeText={(text) => setTestGuessCacheNum(text)}
          onSubmitEditing={() => {
            handleTestGuessCache();
          }}
          placeholder="Enter Puzzle Number"
          returnKeyType="go"
          keyboardType="default"
          blurOnSubmit={false}
          placeholderTextColor={colors.colors.textInputColor}
        />
        <TextInput
          style={{
            width: "80%",
            fontSize: 16,
            color: colors.colors.textColor,
            margin: 9,
            padding: 5,
            borderWidth: 1,
          }}
          value={testGuessCacheWord}
          onChangeText={(text) => setTestGuessCacheWord(text)}
          onSubmitEditing={() => {
            handleTestGuessCacheSubmit();
          }}
          placeholder="Enter a guess"
          returnKeyType="go"
          keyboardType="default"
          blurOnSubmit={false}
          placeholderTextColor={colors.colors.textInputColor}
        />
        <Button onPress={handleTestGuessCacheSubmit} />

        <View
          style={{
            width: "90%",
            alignSelf: "center",
            borderWidth: 1,
            marginTop: 10,
            marginBottom: 10,
          }}
        />
        <View style={{ paddingBottom: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Button({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.colors.checkButtonColor,
        width: 200,
        height: 40,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
      }}
    >
      <AppText style={{ color: colors.colors.white, fontSize: 20 }}>
        Run Test
      </AppText>
    </TouchableOpacity>
  );
}

export default TestTime;
