import React, { useState,} from "react";

import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Text,
  Linking,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView
} from "react-native";

import colors from "../../config/colors";
import AppButton from "../../components/AppButton";
import AppText from "../../components/AppText";
import cache from "../../utility/cache";
import i18n from "i18n-js";
import translate from "../../config/translate";

function MakeOrJoin({ onClose }) {
  const [isStoring, setIsStoring] = React.useState(false);
  var groupName = "";
  const checkAndStore = async () => {
    if (!groupName) {
      setnameerror(true);
      Alert.alert(i18n.t("Pleaseenterascreenname"));
      return;
    }
    setIsStoring(true);
    await cache.storeData("FLIXPIX::SCREENNAME", groupName);
    setIsStoring(false);
    onClose(groupName);
  };
  const [nameerror, setnameerror] = useState(false);
  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.FullView}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} pointerEvents="box-none" style={styles.absoluteCover}>
          <View pointerEvents="box-none" style={styles.CardArea}>
            <AppText style={{ marginLeft: 18, fontSize: 25, marginTop: 20 }}>
              {i18n.t("EnterYourScreenName")}:
            </AppText>
            <TextInput
              style={[styles.input,{borderWidth:nameerror? 2: 0}]}
              underlineColorAndroid="transparent"
              placeholder={i18n.t("Name")}
              placeholderTextColor={nameerror? colors.secondary: colors.AAText}
              autoCapitalize="none"
              onChangeText={(text) => {
                groupName = text;
              }}
            />

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: 18,
                alignItems: "center",
              }}
            >
              <AppText style={{ fontSize: 10 }}>
                {i18n.t("BySubmittingYouAgreeToThe")}
              </AppText>
              <Text
                style={{ marginLeft: 2, color: colors.primary, fontSize: 10 }}
                onPress={() =>
                  Linking.openURL("https://flixpix.app/terms-and-conditions")
                }
              >
                {i18n.t("TermsAndConditions")}
              </Text>
            </View>
            {!isStoring && (
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  bottom: 10,
                  zIndex: 2,
                }}
              >
                <AppButton
                  onPress={checkAndStore}
                  title={i18n.t("SUBMITSCREENNAME")}
                ></AppButton>
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
    height: 250,
    width: "90%",
    backgroundColor: colors.fg06,
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    justifyContent: "flex-start",
    shadowOpacity: 0.4,
    shadowRadius: 7,
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
  input: {
    margin: 15,
    height: 40,
    padding: 10,
    fontSize: 16,
    fontWeight: "500",
    borderColor: colors.primaryTransparent,
    color: colors.primaryText,
    zIndex: 2,

    borderColor:colors.red,
    backgroundColor:colors.fg08,
    borderRadius:30,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 1,
    shadowOpacity: 0.1,
  },
});

export default MakeOrJoin;
