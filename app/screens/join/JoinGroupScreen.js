import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Image,
  View,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import SmoothPinCodeInput from "react-native-smooth-pincode-input";

import Header from "../../components/Header";
import LottieView from "lottie-react-native";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import { Entypo } from "@expo/vector-icons";
import AppButton from "../../components/AppButton";
import { color } from "react-native-reanimated";
import useApi from "../../hooks/useApi";
import group from "../../api/group";
import cache from "../../utility/cache";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import i18n from "i18n-js";
import translate from "../../config/translate";
import * as Haptics from "expo-haptics";
function MakeOrJoin({
  onCreate,
  onJoin,
  onClose,
  prefill = "",
  screenName,
  pushToken,
}) {
  const patchJoinGroup = useApi(group.joinGroup);
  const [loading, setLoading] = useState(false);

  //this is new for the pin
  const CELL_COUNT = 7;

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  React.useEffect(() => {
    setValue(prefill);
  }, [prefill]);
  //this is new for the pin

  function joinGroup() {
    if (/[A-Z][0-9]{6}/.test(value.toUpperCase().slice(0, 7))) {
      setLoading(true);
      patchJoinGroup
        .request(value.toUpperCase(), screenName, pushToken)
        .then(async (response) => {
          if (response.data.errorMessage) {
            Alert.alert(i18n.t("Invalid join code"));
          } else {
            const storeData = { ...response.data.group, isOwner: false };
            var groups = await cache.getData("FLIXPIX::GROUPS", false);
            groups = groups ? groups : [];
            for (var i = 0; i < groups.length; i++) {
              if (groups[i].groupID == storeData.groupID) {
                Alert.alert(i18n.t("You have already joined this group"));
                setLoading(false);
                return;
              }
            }
            groups.push(storeData);
            cache.storeData("FLIXPIX::GROUPS", groups);
            await cache.storeData(
              "FLIXPIX::" + response.data.group.groupID + "::MOVIE_BATCH=1",
              response.data.shows
            );
            cache.storeData(
              "FLIXPIX::" + response.data.group.groupID + "::numMembers",
              response.data.group.numMembers
            );
            cache.storeData(
              "FLIXPIX::" + response.data.group.groupID + "::JOIN_CODE",
              response.data.joinCode
            );
            setLoading(false);
            onJoin(storeData);
          }
          setLoading(false);
        });
    } else {
      if (Platform.OS === "ios") Haptics.notificationAsync();
      Alert.alert(i18n.t("JCNV"));
    }
  }

  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.FullView}>
        <TouchableWithoutFeedback delayPressIn={0} onPress={onClose}>
          <View
            style={{ flex: 1, justifyContent: "center", overflow: "hidden" }}
          ></View>
        </TouchableWithoutFeedback>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          pointerEvents="box-none"
          style={styles.absoluteCover}
        >
          <View pointerEvents="box-none" style={styles.CardArea}>
            <View
              style={{
                flex: 0.8,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <AppText style={{ marginBottom: 20, color: colors.primaryText }}>
                {i18n.t("JoinCode")}:
              </AppText>
              {/* <SmoothPinCodeInput
                cellSize={40}
                autoFocus={prefill ? false : true}
                textStyleFocused={{ color: colors.primary }}
                cellStyleFocused={{
                  borderColor: colors.primary,
                  borderWidth: 2,
                }}
                animated={false}
                cellStyle={{
                  borderRadius: 15,
                  borderColor: colors.AAText,
                  borderWidth: 3,
                  height: 60,
                }}
                keyboardType="email-address" //Change to defualt, then numaric
                textStyle={{ color: colors.primaryText, fontSize: 24 }}
                codeLength={7}
                value={enteredCode}
                onTextChange={(enteredCode) => {
                  setEnteredCode(enteredCode.toUpperCase());
                }}
              /> */}
              <CodeField
                ref={ref}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={value}
                caretHidden={false}
                autoFocus={prefill ? false : true}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="default"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    style={[styles.cell, isFocused && styles.focusCell]}
                    key={index}
                  >
                    <AppText
                      key={index}
                      style={[
                        styles.cellText,
                        isFocused && styles.cellTextFocused,
                      ]}
                      onLayout={getCellOnLayoutHandler(index)}
                    >
                      {symbol || (isFocused ? null : null)}
                    </AppText>
                  </View>
                )}
              />
              {!loading && (
                <AppButton
                  // hollow={enteredCode.length <= 6}
                  color="secondary"
                  style={{ marginTop: 50 }}
                  title={i18n.t("Join")}
                  onPress={joinGroup}
                />
              )}
            </View>
            {loading && (
              <View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  alignSelf: "center",
                  alignContent: "center",
                  height: "100%",
                  backgroundColor: "rgba(0,0,0,.1)",
                  justifyContent: "center",
                }}
              >
                <LottieView
                  autoPlay
                  style={{
                    height: 500,
                  }}
                  resizeMode="cover"
                  loop={true}
                  source={require("../../assets/animations/loader.json")}
                />
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  FullView: {
    backgroundColor: colors.backgroundDarken,
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
  },
  CardArea: {
    minHeight: 300,
    width: "90%",
    backgroundColor: colors.fg06,
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    alignContent: "center",
    justifyContent: "center",
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 10,
  },
  AddressText: {
    fontSize: 13.1,
    color: colors.white,
    fontWeight: "bold",
    padding: 10,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
    textAlign: "center",
  },
  absoluteCover: {
    height: "100%",
    width: "100%",
    position: "absolute",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 40,
    lineHeight: 38,
    fontSize: 24,
    textAlign: "center",
    borderRadius: 15,
    borderColor: colors.AAText,
    borderWidth: 3,
    height: 60,
    marginHorizontal: 2,
    padding: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: colors.primaryText,
  },
  cellText: {
    color: colors.primaryText,
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: 20,
  },
  cellTextFocused: {
    color: colors.primary,
    textAlign: "center",
    textTransform: "uppercase",
  },
  focusCell: {
    borderColor: colors.primary,
    borderWidth: 2,
    color: colors.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MakeOrJoin;
