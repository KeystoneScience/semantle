import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  RefreshControl,
  Text,
  Platform,
} from "react-native";
import i18n from "i18n-js";
import translate from "../../config/translate";
import Card from "./Card";
import { ScrollView, Modal } from "react-native";
import colors from "../../config/colors";
import JoinGroupScreen from "../join/JoinGroupScreen";
import MakeOrJoin from "./MakeOrJoin";
import cache from "../../utility/cache";
import { useIsFocused } from "@react-navigation/native";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import group from "../../api/group";
import useApi from "../../hooks/useApi";
import token from "../../api/token";
import ShareScreen from "../ShareScreen";
import AppText from "../../components/Text";
import Header from "../../components/Header";
import analytics from "../../utility/analytics";
import * as Haptics from "expo-haptics";

function UserCouponsScreen({ navigation, route }) {
  // const loadingRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(null);
  const [shareVisible, setShareVisible] = useState({});
  const [joinVisible, setJoinVisible] = useState(null);
  const [groups, setGroups] = useState([]);
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = React.useState(false);
  const [prefillJoinCode, setPrefillJoinCode] = React.useState("");
  const [screenName, setScreenName] = useState("");
  const [pushToken, setPushToken] = useState("");
  const refreshGroupApi = useApi(group.refreshGroups);
  const tokenApi = useApi(token.postToken);
  const patchJoinGroup = useApi(group.joinGroup);
  const scrollRef = useRef();

  const checkFirstTime = async () => {
    const response = await cache.getData("FLIXPIX::SCREENNAME", false);
    if (response) {
      setScreenName(response);
    } else {
      setModalVisible(true);
      patchJoinGroup
        .request("FlixPix_Community", "", "")
        .then(async (response) => {
          if (response.data.errorMessage) {
            return;
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
            setGroups(groups);
            cache.storeData("FLIXPIX::GROUPS", groups);
            await cache.storeData(
              "FLIXPIX::" + response.data.group.groupID + "::MOVIE_BATCH=1",
              response.data.shows
            );
            await cache.storeData(
              "FLIXPIX::" + response.data.group.groupID + "::JOIN_CODE",
              response.data.joinCode
            );
          }
        });
    }
  };

  const runTutorial = () => {
    analytics.setScreen("Tutorial");
    navigation.navigate("Tutorial");
  };
  const refreshGroups = async (force = false) => {
    if (!force) {
      const newReload = await cache.getData("FLIXPIX::RELOAD_GROUPS", true, 5);
      if (newReload) {
        return;
      }
    }
    cache.storeData("FLIXPIX::RELOAD_GROUPS", true);
    setRefreshing(true);
    const groupIDsArray = [];
    const storedGroups = await cache.getData("FLIXPIX::GROUPS", false);
    if (!storedGroups) {
      setRefreshing(false);
      return;
    }
    for (let i = 0; i < storedGroups.length; ++i) {
      await groupIDsArray.push(storedGroups[i].groupID);
      cache.storeData(
        "FLIXPIX::" + storedGroups[i].groupID + "::numMembers",
        storedGroups[i].numMembers
      );
    }
    if (groupIDsArray.length > 0) {
      const response = await refreshGroupApi.request(groupIDsArray);
      setGroups(response.data);
      cache.storeData("FLIXPIX::GROUPS", response.data);
    }
    setRefreshing(false);
  };
  const onRefresh = React.useCallback(() => {
    refreshGroups(true);
  }, []);

  registerForPushNotificationsAsync = async () => {
    var token = null;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        return token;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          experienceId: "@nateastone/FlixPix",
        })
      ).data;
      console.log("TOKEN", token);
    } else {
      // console.warn("NO NOTIFICATIONS ARE SENT TO NON-PHYSICAL DEVICES!")
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  };

  const resetLandingGroups = () => {
    cache.getData("FLIXPIX::GROUPS", false).then((data) => {
      setGroups(data ? data : []);
    });
  };

  useEffect(() => {
    Linking.getInitialURL().then((url) => {
      _handleDeepLinking({ url: url });
    });
    Linking.addEventListener("url", _handleDeepLinking);
    return () => {
      Linking.removeEventListener("url");
    };
  }, []);

  const _handleDeepLinking = (event) => {
    let data = Linking.parse(event.url);
    if (data.queryParams.joinCode) {
      setPrefillJoinCode(data.queryParams.joinCode);
      setJoinVisible(true);
    }
  };

  useEffect(() => {
    analytics.setScreen("Landing");
    if (isFocused) {
      refreshGroups();
      resetLandingGroups();
    }
  }, [isFocused]);

  useEffect(() => {
    resetLandingGroups();
    async function getAndPushToken() {
      const previousToken = await cache.getData("FLIXPIX::PUSH_TOKEN", false);
      if (previousToken) {
        console.log("TOKEN", previousToken);
        setPushToken(previousToken);
        return;
      }
      const token = await registerForPushNotificationsAsync();
      if (token) {
        await tokenApi.request(token);
        setPushToken(token);
        console.log("TOKEN", token);
        cache.storeData("FLIXPIX::PUSH_TOKEN", token);
      }
    }
    getAndPushToken();
    checkFirstTime();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header
        foldout={true}
        onfoldoutPress={() => navigation.navigate("Drawer")}
        rankVisible={true}
        onRankPress={() => navigation.navigate("Likes")}
        searchVisible={true}
        onSearchPress={() => {
          navigation.navigate("Search");
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            color={colors.primaryText}
            tintColor={colors.primaryText}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        style={{ flex: 1, overflow: "visible" }}
        ref={scrollRef}
        onContentSizeChange={() => {
          if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: false });
          }
        }}
      >
        {groups.length > 0 &&
          groups.map((groupMovie) => (
            <Card
              key={groupMovie.groupID + Math.random().toString()}
              {...groupMovie}
              onSharePress={() => {
                if (Platform.OS === "ios") Haptics.selectionAsync();
                setShareVisible({
                  groupID: groupMovie.groupID,
                  name: groupMovie.name,
                });
              }}
              onPress={() => {
                if (Platform.OS === "ios") Haptics.selectionAsync();
                navigation.navigate("Swipe", { ...groupMovie });
              }}
              onLongPress={() => {
                if (Platform.OS === "ios") Haptics.notificationAsync();
                Alert.alert(
                  i18n.t("Leave Group"),
                  "",
                  [
                    {
                      text: i18n.t("Cancel"),
                      onPress: () => {},
                    },
                    {
                      text: i18n.t("OK"),
                      onPress: () => {
                        analytics.logEvent(
                          "LEAVING GROUP",
                          group.id,
                          "Landing"
                        );
                        cache
                          .getData("FLIXPIX::GROUPS", false)
                          .then((groupsSet) => {
                            const newGroupSet = groupsSet.filter(
                              (group) => group.groupID !== groupMovie.groupID
                            );
                            cache
                              .storeData("FLIXPIX::GROUPS", newGroupSet)
                              .then(() => {
                                setGroups(newGroupSet ? newGroupSet : []);
                              });
                          });
                      },
                    },
                  ],
                  { cancelable: false }
                );
              }}
            />
          ))}
        <View style={{ height: 150 }} />
      </ScrollView>
      <View pointerEvents="box-none" style={styles.modalScreenDiv}>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <MakeOrJoin
            onClose={(screenName) => {
              setModalVisible(false);
              setScreenName(screenName);
              runTutorial();
            }}
          ></MakeOrJoin>
        </Modal>
      </View>
      <View pointerEvents="box-none" style={styles.modalScreenDiv}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={shareVisible.name != null}
        >
          <ShareScreen
            onClose={() => {
              setShareVisible({});
            }}
            groupName={shareVisible.name}
            groupID={shareVisible.groupID}
          ></ShareScreen>
        </Modal>
      </View>
      <View pointerEvents="box-none" style={styles.modalScreenDiv}>
        <Modal animationType="fade" transparent={true} visible={joinVisible}>
          <JoinGroupScreen
            onClose={() => {
              setJoinVisible(false);
              setPrefillJoinCode("");
            }}
            onJoin={(groupMovieData) => {
              resetLandingGroups();
              setJoinVisible(false);
              navigation.navigate("Swipe", { ...groupMovieData });
            }}
            screenName={screenName ? screenName : "~"}
            pushToken={pushToken ? pushToken : null}
            prefill={prefillJoinCode}
          ></JoinGroupScreen>
        </Modal>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "17%",
          paddingBottom: 15,
          backgroundColor: colors.fg06,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: colors.secondary,
            width: "100%",
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
          onPress={() => {
            if (Platform.OS === "ios") Haptics.selectionAsync();
            setJoinVisible(true);
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#FFF",
              fontWeight: "600",
              fontSize: 20,
            }}
          >
            {i18n.t("JoinGroup")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (Platform.OS === "ios") Haptics.selectionAsync();
            navigation.navigate("Create", {
              screenName: screenName,
              pushToken: pushToken,
            });
          }}
          style={{
            backgroundColor: colors.fg06,
            width: "100%",
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: colors.primary,
              fontWeight: "600",
              fontSize: 20,
            }}
          >
            {i18n.t("CreateGroup")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  BackMod: {
    backgroundColor: "rgba(0,0,0,.4)",
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  modalScreenDiv: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
});

export default UserCouponsScreen;
