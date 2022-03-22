import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import AppText from "./AppText";
import colors from "../configs/colors";

function MainInput(props) {
  var textInputRef = useRef();
  const [value, setValue] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  return (
    <View
      style={{
        width: "100%",
        // height: 200,
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
        marginTop: 0,
        marginBottom: 10,
        flexDirection: "row",
        // justifyContent: "center",
      }}
    >
      <View
        // tint="light"
        // intensity={70}
        style={{
          // borderRadius: 10,
          borderBottomColor: "rgba(0,0,0,0.4)",
          borderBottomWidth: 2,
          overflow: "hidden",
          width: "70%",
          display: "flex",
          flexDirection: "row",
          paddingLeft: 10,
          margin: 10,
          color: "rgba(0,0,0,0.4)",
          // backgroundColor: "rgba(255,255,255,1)",
        }}
      >
        <AppText
          style={[
            {
              width: "70%",
              fontSize: 21,
              // padding: 2,
              color: props.input
                ? colors.darkenColor(colors.colors.backgroundColor, 32)
                : "rgba(0,0,0,0.5)",
              textTransform: "lowercase",
            },
          ]}
        >
          {props.input || "Enter your guess"}
        </AppText>
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
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => {
          setIsPressed(true);
        }}
        onPress={() => {
          props.onSubmit(value);
        }}
        onPressOut={() => {
          setIsPressed(false);
        }}
        style={{
          backgroundColor: colors.colors.checkButtonColor,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          height: 40,
          width: "21%",
          margin: 10,
          borderRadius: 10,
          shadowOffset: {
            width: 0,
            height: isPressed ? 2 : 6,
          },
          shadowColor: colors.darkenColor(colors.colors.checkButtonColor, 65),
          transform: [
            {
              translateY: isPressed ? 4 : 0,
            },
          ],
          shadowOpacity: 1,
          shadowRadius: 0,
          elevation: 2,
        }}
      >
        <AppText
          style={{
            color: colors.lightenColor(colors.colors.checkButtonColor, 85),
            fontSize: 23,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            anchor: "center",
            // fontWeight: "700",
            padding: 0,
          }}
        >
          CHECK
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

export default MainInput;

// const styles = StyleSheet.create({});
