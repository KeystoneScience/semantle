import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import AppText from "./AppText";
import colors from "../configs/colors";

function MainInput(props) {
  var textInputRef = useRef();
  const [value, setValue] = useState("");
  return (
    <View
      style={{
        width: "100%",
        // height: 200,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        marginTop: 20,
        marginBottom: 10,
        flexDirection: "row",
        // justifyContent: "center",
      }}
    >
      <BlurView
        tint="light"
        intensity={70}
        style={{
          borderRadius: 10,
          overflow: "hidden",
          width: "70%",
          display: "flex",
          flexDirection: "row",

          margin: 10,
          color: "#000",
          // backgroundColor: "rgba(255,255,255,1)",
        }}
      >
        <Text
          style={[
            {
              width: "70%",
              fontSize: 18,
              padding: 9,
              color: props.input ? "#000" : "rgba(0,0,0,0.5)",
              textTransform: "lowercase",
            },
          ]}
        >
          {props.input || "Enter your guess"}
        </Text>
        {/* <TextInput
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
        /> */}
      </BlurView>
      <TouchableOpacity
        onPress={() => {
          props.onSubmit(value);
        }}
        style={{
          backgroundColor: colors.colors.grooveColorPallet[8],
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          height: 50,
          width: "20%",
          margin: 10,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            anchor: "center",
            fontWeight: "700",
            padding: 0,
          }}
        >
          CHECK
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default MainInput;

// const styles = StyleSheet.create({});
