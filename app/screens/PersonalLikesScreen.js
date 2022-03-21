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

import Header from "../components/Header";
import { ScrollView, Modal } from "react-native";
import colors from "../config/colors";
import AppText from "../components/Text";
import LottieView from "lottie-react-native";
import MoreMovieInfo from "./stats/MoreMovieInfo";
import cache from "../utility/cache";
import { Modalize } from "react-native-modalize";
import { FontAwesome } from "@expo/vector-icons";
import Fade from "../components/Fade";
import i18n, { l } from "i18n-js";
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
  const [loading, setLoading] = useState(false);
  const [likesArray, setLikesArray] = useState([]);
  const [shortenedLikesArray, setShortenedLikesArray] = useState([]);
  const modalizeRef = useRef();

  const loadMoreLikes = () => {
    if (likesArray.length > shortenedLikesArray.length) {
      setShortenedLikesArray(
        likesArray.slice(0, shortenedLikesArray.length + 24)
      );
    }
  };

  const getLikes = async () => {
    let likeArray = await cache.getData("FLIXPIX::likes", false);
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

  useEffect(() => {
    getLikes();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header
        backVisible={true}
        onBackPress={() => {
          navigation.navigate("Landing");
        }}
      />
      {!loading && shortenedLikesArray.length == 0 && (
        <View style={{ height: 400 }}>
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
              <View style={{ height: 50 }} />
              <LottieView
                autoPlay
                style={{
                  width: "100%",
                  height: 400,
                }}
                resizeMode="cover"
                loop={false}
                source={require("../assets/animations/cow.json")}
              />
              <AppText
                style={{ textAlign: "center", color: colors.primaryText }}
              >
                {i18n.t("NoLikes")}
              </AppText>
            </View>
          </Fade>
        </View>
      )}
      {shortenedLikesArray.length > 0 && (
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
                onLongPress={() => {
                  if (Platform.OS === "ios") Haptics.notificationAsync();
                  Alert.alert(
                    i18n.t("DeleteLike"),
                    "",
                    [
                      {
                        text: "Cancel",
                        onPress: () => {},
                      },
                      {
                        text: "OK",
                        onPress: () => {
                          for (let i = 0; i < likesArray.length; ++i) {
                            if (likesArray[i].id == item.id) {
                              const newLikesArray = likesArray.slice();
                              newLikesArray.splice(i, 1);
                              const shortenedLikesArrayNew =
                                shortenedLikesArray.slice();
                              shortenedLikesArrayNew.splice(i, 1);
                              cache.storeData("FLIXPIX::likes", newLikesArray);
                              setLikesArray(newLikesArray);
                              setShortenedLikesArray(shortenedLikesArrayNew);
                              break;
                            }
                          }
                        },
                      },
                    ],
                    { cancelable: false }
                  );
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
                            : require("../assets/logos/FlixPix_Card.png")
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
            source={require("../assets/animations/loader.json")}
          />
        </View>
      )}
    </View>
  );
}

export default UserCouponsScreen;
