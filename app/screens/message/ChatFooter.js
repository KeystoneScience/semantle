import React, { useRef, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import colors from "../../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ProgressCircle from "react-native-progress-circle";
import * as Haptics from "expo-haptics";
import { AnimatedCircularProgress } from "react-native-circular-progress";
const MAX_MESSAGE_LENGTH = 140;
var alertedUser = false;
var warnedUser = false;
export default function ChatFooter({ onSend, onInteract, onfocus }) {
  const [value, setValue] = useState("");
  const [userTyping, setUserTyping] = useState(false);
  const [height, setHeight] = React.useState(0);
  var textInputRef = useRef();

  function send() {
    if (value) {
      if (value.length > MAX_MESSAGE_LENGTH) {
        Alert.alert(
          "Message too long!",
          "Sorry, your message is longer than the allowed length."
        );
        return;
      }
      onSend(value);
      setValue("");
      textInputRef.current.clear();
    }
  }
  return (
    <View
      style={{
        backgroundColor: colors.fg06,
        opacity: 0.99,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <TextInput
        onContentSizeChange={(event) => {
          setHeight(event.nativeEvent.contentSize.height * 1.2);
        }}
        ref={textInputRef}
        style={[
          {
            borderRadius: 10,
            fontSize: 16,
            padding: 9,
            margin: 10,
            width: "80%",
            color: colors.AAText,
            backgroundColor: colors.fg08,
          },
          { height: Math.min(Math.max(50, height), 400) },
        ]}
        multiline={true}
        value={value}
        onTouchStart={() => {
          onInteract();
          setUserTyping(true);
        }}
        onFocus={onfocus}
        onEndEditing={() => setUserTyping(false)}
        onSubmitEditing={() => {
          send();
        }}
        placeholder="Message..."
        returnKeyType="send"
        keyboardType="default"
        //ref="newMessage"
        // onFocus={this.inputFocused.bind(this, "newMessage")}
        // onBlur={() => {
        //   this.refs.scrollView.scrollTo(0, 0);
        // }}
        placeholderTextColor={colors.AAAText}
        onChangeText={(text) => {
          if (text[text.length - 1] == "\n") {
            return;
          }
          setValue(text);

          if (text.length >= MAX_MESSAGE_LENGTH && !alertedUser) {
            alertedUser = true;
            Haptics.impactAsync();
          } else {
            if (text.length < MAX_MESSAGE_LENGTH) {
              alertedUser = false;
            }
            if (text.length < MAX_MESSAGE_LENGTH - 20) {
              warnedUser = false;
            } else {
              if (!warnedUser) {
                Haptics.impactAsync();
                warnedUser = true;
              }
            }
          }
        }}
      />
      <MaterialCommunityIcons
        onPress={() => {
          send();
        }}
        name="send-circle"
        size={50}
        color={colors.primary}
      />
      <View
        style={{
          position: "absolute",
          right: 28,
          bottom: 0,
          marginBottom: -18,
        }}
      >
        <View style={{ width: 75, height: 50, alignItems: "center", opacity:.95 }}>
          {userTyping && (
            <AnimatedCircularProgress
              lineCap="round"
              size={25}
              width={2}
              fill={Math.floor((value.length / MAX_MESSAGE_LENGTH) * 100)}
              backgroundWidth={1.5}
              tintColor={
                value.length < MAX_MESSAGE_LENGTH - 20
                  ? colors.greenHeart
                  : value.length < MAX_MESSAGE_LENGTH
                  ? colors.yellow
                  : colors.red
              }
              backgroundColor={colors.fg04}
            >
              {(fill) =>
                value.length > 119 && (
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 14,
                      color:
                        value.length < 120
                          ? colors.greenHeart
                          : value.length < MAX_MESSAGE_LENGTH
                          ? colors.yellow
                          : colors.red,
                    }}
                  >
                    {MAX_MESSAGE_LENGTH - value.length > -100
                      ? MAX_MESSAGE_LENGTH - value.length
                      : "!"}
                  </Text>
                )
              }
            </AnimatedCircularProgress>
          )}
        </View>
      </View>
    </View>
  );
}
