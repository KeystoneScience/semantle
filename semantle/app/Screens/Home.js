import React, { useRef, useState, useEffect } from "react";
import MainInput from "../components/MainInput";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import GuessList from "../components/GuessList";
import GuessListHeader from "../components/GuessListHeader";
import semantle from "../functions/semantle";
const guessArray = [
  {
    index: 1,
    guess: "A",
    similarity: "0.9",
    close: "Yes",
  },
  {
    index: 2,
    guess: "B",
    similarity: "0.8",
    close: "Yes",
  },
  {
    index: 3,
    guess: "C",
    similarity: "0.7",
    close: "Yes",
  },
  {
    index: 4,
    guess: "D",
    similarity: "0.6",
    close: "Yes",
  },
];
function Home({ navigation, route }) {
  const semantleGame = semantle();

  // useEffect(() => {
  //   semantleGame.submit("test", "home");
  // }, []);
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(58, 12, 163, .1)",
      }}
    >
      <Text onPress={() => navigation.navigate("Drawer")} style={styles.title}>
        Semantle
      </Text>
      <Text style={styles.subtitle}>can you guess the word?</Text>
      <MainInput
        onSubmit={(value) => {
          semantleGame.submit(value, "test");
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
        }}
      >
        <GuessListHeader />
        <ScrollView>
          {semantleGame.guesses.map((obj, index) => (
            <GuessList key={index} {...obj} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
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
