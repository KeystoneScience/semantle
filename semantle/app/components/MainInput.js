import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { BlurView } from "expo-blur";

function MainInput(props) {
  var textInputRef = useRef();
  const [value, setValue] = useState("");
  return (
    <View
      style={{
        width: "100%",
        // height: 200,
        alignItems: "center",
        // justifyContent: "center",
      }}
    >
      <BlurView
        tint="light"
        intensity={70}
        style={{
          borderRadius: 10,
          overflow: "hidden",
          width: "100%",

          margin: 10,
          width: "80%",
          color: "#000",
          // backgroundColor: "rgba(255,255,255,1)",

          marginTop: 50,
          marginBottom: 20,
        }}
      >
        <TextInput
          ref={textInputRef}
          style={[
            {
              width: "100%",
              fontSize: 18,
              padding: 9,
            },
          ]}
          value={value}
          onChangeText={(text) => setValue(text)}
          onSubmitEditing={() => {
            props.onSubmit(value);
            setValue("");
          }}
          placeholder="Enter your guess"
          returnKeyType="go"
          keyboardType="default"
          placeholderTextColor={"rgba(0,0,0,0.5)"}
        />
      </BlurView>
    </View>
  );
}

export default MainInput;

// const styles = StyleSheet.create({});
