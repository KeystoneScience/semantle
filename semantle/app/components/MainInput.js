import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

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
      <TextInput
        ref={textInputRef}
        style={[
          {
            borderRadius: 10,
            width: "100%",
            fontSize: 16,
            padding: 9,
            margin: 10,
            width: "80%",
            color: "#000",
            backgroundColor: "rgba(0,0,0,0.18)",
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
    </View>
  );
}

export default MainInput;

// const styles = StyleSheet.create({});
