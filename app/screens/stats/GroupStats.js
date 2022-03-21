import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  Platform,
} from "react-native";

import Header from "../../components/Header";
import Card from "./Card";
import { ScrollView, Modal } from "react-native";
import colors from "../../config/colors";
import group from "../../api/group";
import useApi from "../../hooks/useApi";
import AppText from "../../components/Text";
import LottieView from "lottie-react-native";
import MoreMovieInfo from "./MoreMovieInfo";
import SegmentedControl from "@react-native-community/segmented-control";
import cache from "../../utility/cache";
import { Modalize } from "react-native-modalize";
import { FontAwesome } from "@expo/vector-icons";
import Fade from "../../components/Fade";
import i18n from "i18n-js";
import translate from "../../config/translate";
import * as Haptics from "expo-haptics";
function FavIndicator() {
  return (
    <View
      style={{
        width: 30,
        height: 30,
        margin: 3,
        backgroundColor: "#0000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15,
      }}
    >
      <FontAwesome
        name="star"
        size={20}
        backgroundColor="transparent"
        underlayColor="transparent"
        activeOpacity={0.3}
        color={colors.yellow}
      />
    </View>
  );
}

function UserCouponsScreen({ navigation, route }) {
  // const loadingRef = useRef(null);
  const [modalVisible, setModalVisible] = useState({ visible: false });
  const [groups, setGroups] = useState([]);
  const [fullGroups, setFullGroups] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [loading, setLoading] = useState(false);
  const [numGroupMembers, setNumGroupMembers] = useState(0);
  const [likesArray, setLikesArray] = useState([]);
  const [shortenedLikesArray, setShortenedLikesArray] = useState([]);
  const statsAPI = useApi(group.getStats);
  const modalizeRef = useRef();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    const recallTop = async () => {
      await requestVotes(false, true);
      setRefreshing(false);
    };

    recallTop();
  }, []);

  const requestVotes = async (showLoad = true, force = false) => {
    if (showLoad) {
      setLoading(true);
    }
    let response;
    if (!force) {
      response = await cache.getData(
        "FLIXPIX::" + route.params.groupID + "::full_scan",
        true,
        5
      );
      if (!response || !response.data || !response.data.Items) {
        response = await statsAPI.request(route.params.groupID);
        if (!response.data || !response.data.Items) {
          Alert.alert(i18n.t("Network Error"));
          setLoading(false);
          return;
        }
        cache.storeData(
          "FLIXPIX::" + route.params.groupID + "::full_scan",
          response
        );
      }
    } else {
      response = await statsAPI.request(route.params.groupID);
      if (!response.data || !response.data.Items) {
        Alert.alert(i18n.t("Network Error"));
        setLoading(false);
        return;
      }
      cache.storeData(
        "FLIXPIX::" + route.params.groupID + "::full_scan",
        response
      );
    }
    if (response.data && response.data.Items) {
      const sortedArray = response.data.Items.sort(function (a, b) {
        let aScore = 0;
        let bScore = 0;
        aScore += a.superlikes * 1.2;
        aScore += -a.dislikes;
        aScore += a.likes;

        bScore += b.superlikes * 1.2;
        bScore += -b.dislikes;
        bScore += b.likes;

        return -aScore + bScore;
      });
      const filtered = sortedArray.filter(
        (show) => show.likes + show.superlikes > 1
      );
      setFullGroups(filtered);
      setGroups(filtered.slice(0, 5));
      if (showLoad) {
        setLoading(false);
      }
    }
  };

  const loadMoreGroupPicks = () => {
    if (fullGroups.length > groups.length) {
      setGroups(fullGroups.slice(0, groups.length + 5));
    }
  };

  const loadMoreLikes = () => {
    if (likesArray.length > shortenedLikesArray.length) {
      setShortenedLikesArray(
        likesArray.slice(0, shortenedLikesArray.length + 24)
      );
    }
  };

  useEffect(() => {
    const getLikes = async () => {
      let likeArray = await cache.getData(
        "FLIXPIX::" + route.params.groupID + "::likes",
        false
      );
      likeArray = likeArray ? likeArray : [];
      likeArray.sort(function (a, b) {
        const aScore = a.superlike ? 1 : 0;
        const bScore = b.superlike ? 1 : 0;
        return bScore - aScore;
      });
      if (likeArray.length % 3 == 1) {
        likeArray.push({});
      } else if (likeArray.length % 3 == 2) {
        likeArray.push({});
        likeArray.push({});
      }
      setLikesArray(likeArray ? likeArray : []);
      setShortenedLikesArray(likeArray.slice(0, 24));
    };

    const getNumMembers = async () => {
      const numMembers = await cache.getData(
        "FLIXPIX::" + route.params.groupID + "::numMembers",
        false
      );
      if (numMembers) {
        setNumGroupMembers(numMembers);
      }
    };

    getNumMembers();
    getLikes();
    requestVotes();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header
        backVisible={true}
        onBackPress={() => {
          navigation.navigate("Swipe");
        }}
      />
      <View style={{ padding: 10, zIndex: 5, opacity:.95 }}>
        <SegmentedControl
          values={[i18n.t("Group"), i18n.t("Likes")]}
          selectedIndex={selectedIndex}
          onChange={(event) => {
            setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
            setModalVisible({ visible: false });
          }}
          activeFontStyle={{ color: colors.white }}
          fontStyle={{ color: colors.primaryText }}
          tintColor={colors.primary}
          backgroundColor={colors.fg06}
        />
      </View>
      {selectedIndex == 0 && (
        <ScrollView
          style={{
            overflow: "visible",
            flex: 0.9,
          }}
          refreshControl={
            <RefreshControl
              color={colors.primaryText}
              tintColor={colors.primaryText}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <AppText
            style={{
              fontSize: 20,
              fontWeight: "600",
              textAlign: "center",
              paddingBottom: 3,
              paddingTop: 6,
              color: colors.AAText,
            }}
          >
            {i18n.t("GroupTopPicks")}
          </AppText>

          {!loading && groups.length == 0 && (
           <View style={{height: 400,}}>
            <Fade>
              <View
                pointerEvents="none"
                style={{
                  bottom: 0,
                  alignSelf: "center",
                  overflow: "visible",
                  justifyContent: "center",
                }}
              >
                <View style={{ height: 10 }} />
                <LottieView
                  autoPlay
                  style={{
                    width: "100%",
                    height: 400,
                  }}
                  resizeMode="cover"
                  loop={false}
                  source={require("../../assets/animations/cow.json")}
                />
                <AppText
                  style={{ textAlign: "center", color: colors.primaryText }}
                >
                  {i18n.t("NoGroupPicksYetKeepSwiping")}
                </AppText>
              </View>
            </Fade>
          </View>
          )}
          {groups.length > 0 &&
            groups.map((groupMovie, index) => (
              <View style={{height:110}}>
              <Fade>
                <Card
                  key={groupMovie.groupID + Math.random().toString()}
                  {...groupMovie}
                  onPress={() => {
                    if (Platform.OS === "ios") Haptics.selectionAsync();
                    setModalVisible({ visible: true, groupMovie });
                    modalizeRef.current.open();
                  }}
                  numMembers={numGroupMembers}
                  rank={index}
                />
              </Fade>
              </View>
            ))}
          {fullGroups.length > groups.length && (
            <TouchableOpacity
              style={{ padding: 10 }}
              onPress={loadMoreGroupPicks}
            >
              <AppText style={{ color: colors.primary, fontWeight: "600" }}>
                {i18n.t("Load More")}
              </AppText>
            </TouchableOpacity>
          )}
          <View style={{ padding: 50 }} />
        </ScrollView>
      )}
      {selectedIndex == 1 && (
        <ScrollView
          style={{
            overflow: "visible",
            flex: 0.9,
          }}
        >
          <AppText
            style={{
              fontSize: 20,
              fontWeight: "600",
              textAlign: "center",
              paddingBottom: 3,
              paddingTop: 6,
              color: colors.AAText,
            }}
          >
            {i18n.t("YourLikes")}
          </AppText>
          <FlatList
            data={shortenedLikesArray}
            renderItem={({ item }) => (
              <TouchableOpacity
                delayPressIn={0}
                onPress={() => {
                  if (Platform.OS === "ios") Haptics.selectionAsync();
                  if (!item.id) {
                    return;
                  }
                  setModalVisible({ visible: true, groupMovie: item });
                  modalizeRef.current.open();
                }}
                style={{
                  flex: 0.33,
                  flexDirection: "column",
                  margin: 5,
                  height: 180,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  backgroundColor: "#0000",
                  elevation: 4,
                  shadowOpacity: item.isNotPressed ? 0 : 0.5,
                }}
              >
                {item.id && (
                  <View>
                  <Fade>
                    <Image
                      source={
                        item.poster_path
                          ? {
                              uri:
                                "https://image.tmdb.org/t/p/w342" +
                                item.poster_path,
                            }
                          : require("../../assets/logos/FlixPix_Card.png")
                      }
                      style={{
                        width: "100%",
                        height: 175,
                        resizeMode: "contain",
                      }}
                    />
                    {item.superlike && (
                      <View
                        pointerEvents="none"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          zIndex: 10,
                        }}
                      >
                        <FavIndicator />
                      </View>
                    )}
                  </Fade>
                  </View>
                )}
              </TouchableOpacity>
            )}
            //Setting the number of column
            numColumns={3}
            keyExtractor={(item, index) => index}
            style={{ overflow: "visible" }}
          />
          {likesArray.length > shortenedLikesArray.length && (
            <TouchableOpacity style={{ padding: 10 }} onPress={loadMoreLikes}>
              <AppText style={{ color: colors.primary, fontWeight: "600" }}>
                {i18n.t("Load More")}
              </AppText>
            </TouchableOpacity>
          )}
          <View style={{ padding: 60 }} />
        </ScrollView>
      )}
      <Modalize
        modalHeight={Math.floor(Dimensions.get("screen").height * 0.8)}
        ref={modalizeRef}
        handlePosition="inside"
        modalStyle={{ backgroundColor: colors.fg06 }}
        childrenStyle={{
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          overflow: "hidden",
        }}
      >
        <MoreMovieInfo
          {...modalVisible.groupMovie}
          providers={route.params.providers}
          type={route.params.type}
          onSimilarMovie={(movie) => {
            setModalVisible({ visible: true, groupMovie: movie });
          }}
        ></MoreMovieInfo>
      </Modalize>
      
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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightLightGrey,
  },
  viewDiv: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  lottieViewDiv: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  lottieView: {
    width: 400,
    height: 400,
  },
  BackMod: {
    backgroundColor: "rgba(0,0,0,.4)",
    alignContent: "center",
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  noCouponText: {
    width: "100%",
    color: colors.mediumGrey,
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  // TitleDiv: {
  //   borderBottomWidth: 1.2,
  //   width: "70%",
  //   alignSelf: "center",
  //   marginBottom: 6,
  // },

  // Title: {
  //   fontSize: 40,
  //   fontWeight: "bold",
  //   color: colors.black,
  //   textAlign: "center",
  // },
  motalScreenDiv: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  spaceRow: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    marginBottom: -5,
  },
  numberofSpace: {
    fontSize: 28,
    fontWeight: "bold",
    // color: "rgba(36, 36, 36, .8)",
    color: colors.black,
    textAlign: "center",
    marginLeft: 2,
  },
  urPack: {
    height: 40,
    width: 45,
    overflow: "visible",
    resizeMode: "contain",
  },
  itemBoxButton: {
    position: "absolute",
    top: 2,
    right: 14,
    padding: 5,
  },
  itemBoxText: {
    fontSize: 12.5,
    textAlign: "center",
    marginTop: -5,
  },
});

export default UserCouponsScreen;
