import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Image,
  View,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Share,
  Clipboard,
} from "react-native";
import FadeNotificaiton from "../components/FadeNotification";

import colors from "../config/colors";
import AppText from "../components/AppText";
import { EvilIcons } from "@expo/vector-icons";
import AppButton from "../components/AppButton";
import cache from "../utility/cache";
import useApi from "../hooks/useApi";
import group, { getJoinCode } from "../api/group";
import { Entypo } from "@expo/vector-icons";
import Constants from "expo-constants";
import i18n from "i18n-js";
import translate from "../config/translate";
import analytics from "../utility/analytics";
const toastConfig = () => (
  <View
    style={{
      height: 50,
      width: "40%",
      backgroundColor: colors.greenHeart,
      borderRadius: 15,
      display: "flex",
      flexDirection: "row",
      paddingRight: 10,
    }}
  >
    <View
      style={{
        alignContent: "center",
        justifyContent: "center",
        paddingLeft: 10,
      }}
    >
      <Entypo
        name="check"
        size={20}
        style={{ alignSelf: "center", paddingTop: 2 }}
        backgroundColor="transparent"
        underlayColor="transparent"
        activeOpacity={0.3}
        color={colors.white}
      />
    </View>
    <View
      style={{
        alignContent: "center",
        justifyContent: "center",
        paddingLeft: 10,
      }}
    >
      <AppText style={{ color: colors.white, fontWeight: "800", fontSize: 15 }}>
        Copied to clipboard
      </AppText>
    </View>
  </View>
);

function MakeOrJoin({ onCreate, onJoin, onClose, groupName, groupID }) {
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fetchJoinCode = useApi(getJoinCode);
  const [copyIndex, setCopyIndex] = useState(0);

  useEffect(() => {
    cache.getData("FLIXPIX::" + groupID + "::JOIN_CODE").then((data) => {
      if (data) {
        setJoinCode(data);
      }
    });
    analytics.logEvent("SHARE CODE");
  }, []);
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "FlixPix | " +
          i18n.t("Download the app, and join") +
          " " +
          groupName +
          ": " +
          joinCode.substring(0, 1) +
          "-" +
          joinCode.substring(1, 4) +
          "-" +
          joinCode.substring(4, 7) +
          " " +
          i18n.t("let's find what to watch"),
        url: "https://www.flixpix.app/deeplink?joinCode=" + joinCode,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        //pressButton();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(joinCode);
    setCopyIndex(copyIndex + 1);
  };

  const generateJoinCode = async () => {
    setIsLoading(true);
    fetchJoinCode.request(groupID).then((data) => {
      setIsLoading(false);
      setJoinCode(data.data.joinCode);
      cache.storeData(
        "FLIXPIX::" + groupID + "::JOIN_CODE",
        data.data.joinCode
      );
    });
  };
  return (
    <View style={styles.FullView}>
      <TouchableWithoutFeedback delayPressIn={0} onPress={onClose}>
        <View
          style={{ flex: 1, justifyContent: "center", overflow: "hidden" }}
        ></View>
      </TouchableWithoutFeedback>
      <View
        pointerEvents="none"
        style={{
          zIndex: 100,
          position: "absolute",
          top: Constants.statusBarHeight - 5,
          width: "100%",
          height: 75,
        }}
      >
        {copyIndex > 0 && (
          <FadeNotificaiton renderIndex={copyIndex}>
            {toastConfig}
          </FadeNotificaiton>
        )}
      </View>
      <View pointerEvents="box-none" style={styles.absoluteCover}>
        {joinCode !== "" && (
          <View pointerEvents="box-none" style={styles.CardArea}>
            <View
              style={{
                flex: 0.8,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <AppText
                style={{
                  fontSize: 25,
                  marginBottom: 40,
                  color: colors.AAText,
                }}
              >
                {i18n.t("JoinCode")}:
              </AppText>
              <TouchableOpacity onPress={copyToClipboard}>
                <AppText style={{ fontSize: 33, color: colors.primaryText }}>
                  {joinCode.substring(0, 1)}-{joinCode.substring(1, 4)}-
                  {joinCode.substring(4, 7)}
                </AppText>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{ position: "absolute", top: 15, right: 15 }}
              onPress={onShare}
              delay={0}
            >
              <EvilIcons
                name="share-apple"
                size={30}
                color={colors.backbround_icon}
              />
            </TouchableOpacity>
          </View>
        )}
        {joinCode === "" && (
          <View pointerEvents="box-none" style={styles.CardArea}>
            <View
              style={{
                flex: 0.8,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <AppText
                style={{
                  fontSize: 16,
                  marginBottom: 40,
                }}
              >
                {isLoading
                  ? i18n.t("GeneratingCode") + "..."
                  : i18n.t("Lookslikeyourlastjoincodeexpired")}
              </AppText>
              {!isLoading && (
                <AppButton
                  title={i18n.t("GenerateCode")}
                  onPress={generateJoinCode}
                />
              )}
            </View>
          </View>
        )}
      </View>
    </View>
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
    minHeight: "30%",
    width: "90%",
    backgroundColor: colors.fg06,
    marginTop: -25,
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    alignContent: "center",
    justifyContent: "center",
    elevation: 4,
  },
  absoluteCover: {
    height: "100%",
    width: "100%",
    position: "absolute",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MakeOrJoin;
