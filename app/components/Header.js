import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import colors from "../config/colors";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import cache from "../utility/cache";
import { Octicons } from "@expo/vector-icons";
import i18n from "i18n-js";
import translate from "../config/translate";
import { LinearGradient } from "expo-linear-gradient";
import CountryPicker, {
  DARK_THEME,
  LIGHT_THEME,
} from "react-native-country-picker-modal";
import * as Haptics from "expo-haptics";
function Header({
  backVisible = false,
  plusVisible = false,
  rankVisible = false,
  searchVisible = false,
  rankNotificaiton = false,
  chatNotification = false,
  groupInfoVisble = false,
  regionInfooVisible = false,
  chatVisible = false,
  groupInfoVisbleFar = false,
  pifView = false,
  foldout = false,
  onfoldoutPress,
  onHeartPress,
  countryCodes,
  onSearchPress,
  defaultCountry = "US",
  onRegionSelect,
  onPlusPress,
  onBackPress,
  onChatPress,
  onStatsPress,
  onSharePress,
  onRankPress,
  onGroupInfoPress,
  logoVisible,
}) {
  useEffect(() => {
    if (defaultCountry) {
      setCountryCode(defaultCountry);
    }
  }, [defaultCountry]);
  const [countryCode, setCountryCode] = useState(defaultCountry);
  const [country, setCountry] = useState(null);
  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCountry(country);
    onRegionSelect(country.cca2, country.name);
    return false;
  };
  return (
    <View style={{ zIndex: 1 }}>
      <View
        style={{
          backgroundColor: colors.topHeaderColor,
          height: Constants.statusBarHeight,
        }}
      />

      <View style={styles.bar}>
        <LinearGradient
          // Background Linear Gradient
          colors={[
            "rgba(0,0,0,.95)",
            "rgba(0,0,0,.9)",
            "rgba(0,0,0,.6)",
            "transparent",
          ]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {foldout && (
          <TouchableOpacity
            delayPressIn={0}
            style={{
              position: "absolute",
              left: 5,
              paddingRight: 5,
              paddingVertical: 5,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              width: 50,
            }}
            onPress={onfoldoutPress}
          >
            <Octicons name="three-bars" size={26} color={colors.white} />
          </TouchableOpacity>
        )}
        {backVisible && (
          <TouchableOpacity
            delayPressIn={0}
            style={{
              position: "absolute",
              left: 5,
              paddingRight: 5,
              paddingVertical: 5,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              width: 50,
            }}
            onPress={onBackPress}
          >
            <Ionicons
              name="chevron-back-outline"
              size={29}
              color={colors.white}
            />
          </TouchableOpacity>
        )}
        {plusVisible && (
          <TouchableOpacity
            delayPressIn={0}
            style={{ position: "absolute", right: 15 }}
            onPress={onPlusPress}
          >
            <AntDesign name="plus" size={24} color={colors.white} />
          </TouchableOpacity>
        )}

        {searchVisible && (
          <TouchableOpacity
            delayPressIn={0}
            style={{
              position: "absolute",
              right: 48,
              paddingVertical: 8,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              width: 50,
            }}
            onPress={onSearchPress}
          >
            <Ionicons name="ios-search" size={28} color="white" />
          </TouchableOpacity>
        )}
        {rankVisible && (
          <TouchableOpacity
            delayPressIn={0}
            style={{
              position: "absolute",
              right: 5,
              paddingVertical: 8,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              width: 50,
            }}
            onPress={onRankPress}
          >
            <AntDesign name="heart" size={20} color={colors.white} />
            {rankNotificaiton && (
              <View
                style={{
                  position: "absolute",
                  borderRadius: 8,
                  backgroundColor: "#D50000",
                  width: 15,
                  height: 15,
                  top: 15,
                  right: 5,
                }}
              />
            )}
          </TouchableOpacity>
        )}
        {regionInfooVisible && (
          <View style={{ position: "absolute", right: 15 }}>
            <CountryPicker
              {...{
                withFilter: true,
                withEmoji: true,
                withFlagButton: true,
                withAlphaFilter: true,
                countryCodes: countryCodes,
                countryCode,
                onSelect,
              }}
              visible={false}
              theme={colors.theme == "light" ? LIGHT_THEME : DARK_THEME}
            />
          </View>
        )}

        {groupInfoVisble && (
          <TouchableOpacity
            delayPressIn={0}
            style={{
              position: "absolute",
              right: 5,
              zIndex: 10,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              width: 50,
            }}
            onPress={onGroupInfoPress}
          >
            <FontAwesome5 name="user-plus" size={20} color={colors.white} />
          </TouchableOpacity>
        )}
        {groupInfoVisbleFar && (
          <TouchableOpacity
            delayPressIn={0}
            style={{
              position: "absolute",
              right: 95,
              zIndex: 10,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              width: 50,
            }}
            onPress={onGroupInfoPress}
          >
            <FontAwesome5 name="user-plus" size={20} color={colors.white} />
          </TouchableOpacity>
        )}
        {chatVisible && (
          <TouchableOpacity
            delayPressIn={0}
            style={{
              position: "absolute",
              right: 48,
              padding: 4,
              borderRadius: 30,
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              width: 50,
              zIndex: 10,
            }}
            onPress={onChatPress}
          >
            <Ionicons name="chatbubbles" size={26} color={colors.white} />
            {chatNotification && (
              <View
                style={{
                  position: "absolute",
                  borderRadius: 8,
                  backgroundColor: "#D50000",
                  width: 15,
                  height: 15,
                  top: 15,
                  right: 5,
                }}
              />
            )}
          </TouchableOpacity>
        )}
        {pifView && (
          <TouchableOpacity
            delayPressIn={0}
            style={{ position: "absolute", right: 105, zIndex: 10 }}
            onPress={onHeartPress}
          >
            <AntDesign name="heart" size={20} color={colors.white} />
          </TouchableOpacity>
        )}
        <View pointerEvents="box-none" style={{ height: "100%", padding: 11 }}>
          <TouchableWithoutFeedback
            onLongPress={() => {
              if (Platform.OS === "ios") Haptics.notificationAsync();
              Alert.alert(
                i18n.t("Clear all app data"),
                i18n.t(
                  "this action will delete all groups and all user data This is PERMANENT"
                ),
                [
                  {
                    text: "Cancel",
                    onPress: () => {},
                  },
                  {
                    text: "OK",
                    onPress: () => {
                      cache.clearAsyncStorage();
                    },
                  },
                ],
                { cancelable: false }
              );
            }}
          >
            <Image
              style={{ resizeMode: "contain", height: "100%" }}
              source={require("../assets/logos/logo_200.png")}
            ></Image>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    alignItems: "center",
    // backgroundColor: colors.topHeaderColor,
    height: 64,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    zIndex: 1,
  },
  text: {
    color: colors.whiteText,
  },
});

export default Header;
