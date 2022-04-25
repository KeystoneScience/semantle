import React, { useRef, useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import AppText from "./AppText";
import useColors from "../configs/useColors";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
function MainInput(props) {
  var textInputRef = useRef();
  const colors = useColors();
  const [value, setValue] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const unsubscribe = NetInfo.addEventListener((state) => {
    if (isConnected != state.isConnected) {
      setIsConnected(state.isConnected);
    }
  });

  // To unsubscribe to these update, just use:
  unsubscribe();
  return (
    <View
      style={{
        zIndex: 11,
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
          borderBottomColor: colors.colors.textInputColor,
          borderBottomWidth: 2,
          overflow: "hidden",
          width: "70%",
          display: "flex",
          flexDirection: "row",
          paddingLeft: 10,
          margin: 10,
          color: colors.colors.textInputColor,
          // backgroundColor: "rgba(255,255,255,1)",
        }}
      >
        {colors.checkTheme("original") ? (
          <TextInput
            ref={textInputRef}
            style={{
              width: "100%",
              fontSize: 18,
              color: colors.colors.textColor,
              padding: 9,
            }}
            value={value}
            onChangeText={(text) => setValue(text)}
            onSubmitEditing={() => {
              var text = value;
              //remove any spaces at the beginning and end of the string
              text = text.trim();
              //remove any spaces in the middle of the string and replace with a single space
              text = text.replace(/\s+/g, "_");
              if (isConnected) {
                props.onSubmit(text);
              } else {
                Alert.alert("You are not connected to the internet.");
              }
              setValue("");
            }}
            onFocus={props.onFocus}
            placeholder="enter your guess here"
            returnKeyType="go"
            keyboardType="default"
            blurOnSubmit={false}
            placeholderTextColor={colors.colors.textInputColor}
          />
        ) : (
          <TextInput
            ref={textInputRef}
            style={{
              width: "100%",
              fontSize: 18,
              color: colors.colors.textColor,
              padding: 9,
            }}
            value={value}
            onChangeText={(text) => setValue(text)}
            onSubmitEditing={() => {
              var text = value;
              //remove any spaces at the beginning and end of the string
              text = text.trim();
              //remove any spaces in the middle of the string and replace with a single space
              text = text.replace(/\s+/g, "_");
              if (isConnected) {
                props.onSubmit(text);
              } else {
                Alert.alert("You are not connected to the internet.");
              }
              setValue("");
            }}
            onFocus={props.onFocus}
            placeholder="Enter your guess (click here)"
            returnKeyType="go"
            keyboardType="default"
            blurOnSubmit={false}
            placeholderTextColor={colors.colors.textInputColor}
          />
          // <AppText
          //   style={[
          //     {
          //       width: "70%",
          //       fontSize: 21,
          //       // padding: 2,
          //       color: props.input
          //         ? colors.darkenColor(colors.colors.backgroundColor, 32)
          //         : "rgba(0,0,0,0.5)",
          //       textTransform: "lowercase",
          //     },
          //   ]}
          // >
          //   {props.input || "Enter your guess"}
          // </AppText>
        )}
        {!isConnected && (
          <View
            style={{
              position: "absolute",
              right: 0,
              alignSelf: "center",
              backgroundColor: colors.convertColorToRGBA(
                colors.colors.backgroundColor,
                0.85
              ),
              // borderRadius: 20,
              padding: 2,
            }}
          >
            <MaterialCommunityIcons
              name="wifi-off"
              size={19}
              color={"rgba(255, 84, 46, 1)"}
            />
          </View>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => {
          setIsPressed(true);
        }}
        onPress={() => {
          var text = value;
          //remove any spaces at the beginning and end of the string
          text = text.trim();
          //remove any spaces in the middle of the string and replace with a single space
          text = text.replace(/\s+/g, "_");
          if (isConnected) {
            props.onSubmit(text);
          } else {
            Alert.alert("You are not connected to the internet.");
          }
          setValue("");
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
          borderRadius: colors.checkTheme() ? 1 : 10,
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
          shadowOpacity: colors.checkTheme() ? null : 1,
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
            // fontWeight: "700",
            padding: 0,
          }}
        >
          GUESS
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

export default MainInput;

// const styles = StyleSheet.create({});
