import React, { useRef, useState } from "react";
import MainInput from "../components/MainInput";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import GuessList from "../components/GuessList";
import GuessListHeader from "../components/GuessListHeader";
function Home(props) {
  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(58, 12, 163, .1)",
      }}
    >
      <Text style={styles.title}>Semantle</Text>
      <Text style={styles.subtitle}>can you guess the word?</Text>
      <MainInput />
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
        <GuessList index={1} guess={"apple"} similarity={0.5} close="cold" />
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
