import React, { useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import MoreMovieInfo from "./stats/MoreMovieInfo";
import Constants from "expo-constants";
import * as StoreReview from "expo-store-review";
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-deck-swiper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import useApi from "../hooks/useApi";
import ShareScreen from "./ShareScreen";
import Header from "../components/Header";
import colors from "../config/colors";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AppText from "../components/Text";
import cache from "../utility/cache";
import movies from "../api/movies";
import vote from "../api/vote";
import LottieView from "lottie-react-native";
import filters from "../config/filters";
import Fade from "../components/Fade";
import FadeNotificaiton from "../components/FadeNotification";
import useShakeDetection from "../hooks/useShakeDetection";
import { Modalize } from "react-native-modalize";
import WebView from "react-native-webview";
import i18n from "i18n-js";
import group from "../api/group";
import AppButton from "../components/AppButton";
import * as Haptics from "expo-haptics";
import chat from "../api/chat";
import { AnimatedCircularProgress } from "react-native-circular-progress";
//https://image.tmdb.org/t/p/original/ + image path

const cardWidth =
  Dimensions.get("screen").height / Dimensions.get("screen").width > 2.1
    ? Dimensions.get("screen").width * 0.95
    : (Dimensions.get("screen").height * 0.73 * 27.0) / 40.0;
const cardHeight =
  Dimensions.get("screen").height / Dimensions.get("screen").width > 2.1
    ? (Dimensions.get("screen").width * 0.95 * 40.0) / 27.0
    : Dimensions.get("screen").height * 0.73;

const { width } = Dimensions.get("screen");

const stackSize = 4;

const swiperRef = React.createRef();

const toastConfig = {
  likes: () => (
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
        <AntDesign
          name="heart"
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
        <AppText
          style={{ color: colors.white, fontWeight: "800", fontSize: 15 }}
        >
          {i18n.t("Liked")}
        </AppText>
      </View>
    </View>
  ),
  dislikes: () => (
    <View
      style={{
        height: 50,
        width: "40%",
        backgroundColor: colors.red,
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
          paddingLeft: 5,
        }}
      >
        <Entypo
          name="cross"
          size={20}
          style={{ alignSelf: "center" }}
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
          paddingLeft: 5,
        }}
      >
        <AppText
          style={{ color: colors.white, fontWeight: "800", fontSize: 15 }}
        >
          {i18n.t("Disliked")}
        </AppText>
      </View>
    </View>
  ),
  superlikes: () => (
    <View
      style={{
        height: 50,
        width: "46%",
        backgroundColor: colors.yellow,
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
          paddingLeft: 5,
        }}
      >
        <FontAwesome
          name="star"
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
          paddingLeft: 5,
        }}
      >
        <AppText
          style={{ color: colors.white, fontWeight: "800", fontSize: 15 }}
        >
          {i18n.t("TopPick")}
        </AppText>
      </View>
    </View>
  ),
  indifferents: () => (
    <View
      style={{
        height: 50,
        width: "34%",
        backgroundColor: colors.gray,
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
          paddingLeft: 5,
        }}
      ></View>
      <View
        style={{
          alignContent: "center",
          justifyContent: "center",
          paddingLeft: 5,
        }}
      >
        <AppText
          style={{ color: colors.white, fontWeight: "800", fontSize: 15 }}
        >
          {i18n.t("Passed")}
        </AppText>
      </View>
    </View>
  ),
  blank: () => <View></View>,
};

var firstSwipe = true;
const Card = ({ card, groupInformation, onPress }) => {
  if (!card) {
    return <View></View>;
  }
  var numStars = 0;
  var numHalf = 0;
  var numEmpty = 0;
  var starsArray = [];
  var halfArray = [];
  var emptyArray = [];
  const [genres, setGenres] = React.useState([]);
  if (card.vote_average) {
    if (card.vote_average / 2 > 4.5) {
      numStars = 5;
    } else {
      numStars = Math.floor(card.vote_average / 2);
      if (card.vote_average - numStars >= 0.5) {
        numHalf = 1;
      }
      numEmpty = Math.floor(5 - numHalf - numStars);
    }
    starsArray = Array(numStars).fill("");
    halfArray = Array(numHalf).fill("");
    emptyArray = Array(numEmpty).fill("");
  }
  React.useEffect(() => {
    const genresArray = [];
    for (let i = 0; i < card.genre_ids.length; ++i) {
      var found = false;
      for (let j = 0; j < filters.movieGenres.length; j++) {
        if (filters.movieGenres[j].id == card.genre_ids[i]) {
          genresArray.push(filters.movieGenres[j].name);
          found = true;
          break;
        }
      }
      if (!found) {
        for (let j = 0; j < filters.tvGenres.length; j++) {
          if (filters.tvGenres[j].id == card.genre_ids[i]) {
            genresArray.push(filters.tvGenres[j].name);
            found = true;
            break;
          }
        }
      }
    }
    if (genresArray.length > 3) {
      setGenres(genresArray.splice(0, 3));
    } else {
      setGenres(genresArray);
    }
  }, []);

  return (
    <View style={styles.card}>
      <View
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.fg06,
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <Fade>
          <ImageBackground
            source={
              card.poster_path
                ? {
                    uri: "https://image.tmdb.org/t/p/w500" + card.poster_path,
                  }
                : require("../assets/logos/FlixPix_Card.png")
            }
            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
            }}
          >
            <LinearGradient
              // Background Linear Gradient
              colors={["rgba(0,0,0,.7)", "transparent"]}
              style={{ position: "absolute", width: "100%", height: "100%" }}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0.5 }}
            />
            <LinearGradient
              // Background Linear Gradient
              colors={["rgba(0,0,0,.5)", "transparent"]}
              style={{ position: "absolute", width: "100%", height: "100%" }}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 0.3 }}
            />
            <TouchableOpacity
              style={{ width: "100%", height: "100%" }}
              onPress={() => {
                //FIXME
                onPress();
              }}
            >
              {card.vote_average != 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    padding: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View style={{ padding: 2 }}>
                    <AnimatedCircularProgress
                      lineCap="round"
                      size={35}
                      width={4}
                      fill={card.vote_average * 10}
                      backgroundWidth={2.5}
                      tintColor={
                        card.vote_average * 10 < 50
                          ? colors.red
                          : card.vote_average * 10 < 75
                          ? colors.yellow
                          : card.vote_average * 10 <= 100
                          ? colors.greenHeart
                          : colors.primary
                      }
                      backgroundColor="rgba(255, 255, 255, .3)"
                    >
                      {(fill) => (
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 9,
                            color: colors.AATextDARK,
                          }}
                        >
                          {card.vote_average * 10 + "%"}
                        </Text>
                      )}
                    </AnimatedCircularProgress>
                  </View>
                  <Text
                    style={{
                      fontSize: 8,
                      color: colors.AATextDARK,
                      textAlign: "center",
                      fontWeight: "700",
                      marginTop: 2,
                    }}
                  >
                    Audience Rating
                  </Text>
                </View>
              )}
              <View
                style={{
                  padding: 10,
                  paddingRight: 20,
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                }}
              >
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  style={[styles.text, styles.heading, { fontSize: 24 }]}
                >
                  {card.title || card.name}
                </Text>
                <View style={{ flexDirection: "row" }}>
                  {starsArray.map((i, index) => (
                    <Ionicons
                      key={index}
                      name="star-sharp"
                      size={15}
                      color={colors.AATextDARK}
                      style={{
                        textShadowColor: "rgba(0, 0, 0, 0.75)",
                        textShadowRadius: 3,
                      }}
                    />
                  ))}
                  {halfArray.map((i, index) => (
                    <Ionicons
                      key={index}
                      name="md-star-half-sharp"
                      size={15}
                      color={colors.AATextDARK}
                      style={{
                        textShadowColor: "rgba(0, 0, 0, 0.75)",
                        textShadowRadius: 3,
                      }}
                    />
                  ))}

                  {emptyArray.map((i, index) => (
                    <Ionicons
                      key={index}
                      name="md-star-outline"
                      size={15}
                      color={colors.AATextDARK}
                      style={{
                        textShadowColor: "rgba(0, 0, 0, 0.75)",
                        textShadowRadius: 3,
                      }}
                    />
                  ))}
                </View>
              </View>

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  padding: 10,
                }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={25}
                  color={colors.AATextDARK}
                  style={{
                    textShadowColor: "rgba(0, 0, 0, 0.75)",
                    textShadowRadius: 3,
                  }}
                />
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </Fade>
      </View>
    </View>
  );
};

var handOffMovies = [];
var previousVote = {};
var isInShake = false;

function SwipeScreen({ navigation, route }) {
  const [index, setIndex] = React.useState(0);
  const [movieArray, setMovieArray] = React.useState([]);
  const [shareVisible, setShareVisible] = React.useState(false);
  const [matchVisible, setMatchVisible] = React.useState(false);
  const [matchTitle, setMatchTitle] = React.useState("");
  const [currentCard, setCurrentCard] = React.useState(null);
  const [matchPoster, setMatchPoster] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [endOfStack, setEndOfStack] = React.useState(false);
  const [chatNotification, setChatNotification] = React.useState(false);
  const chatAPI = useApi(chat.getChat);
  const [notificationType, setNotificationType] = React.useState({
    type: "blank",
    index: 0,
  });
  const [rankNotification, setRankNotification] = React.useState(false);
  const statsAPI = useApi(group.getStats);

  const [numSuperLikes, setNumSuperLikes] = React.useState(0);
  const [showStar, setShowStar] = React.useState(true);
  //const isOwner = route.params ? route.params.isOwner : false;

  async function checkForRating() {
    let numSwipes = await cache.getData("FlixPix::TotalSwipes", false);
    numSwipes = numSwipes ? numSwipes + 1 : 1;
    if (numSwipes % 80 == 79) {
      if (await StoreReview.isAvailableAsync()) {
        StoreReview.requestReview();
      }
    }
    await cache.storeData("FlixPix::TotalSwipes", numSwipes);
  }

  const groupInformation = route.params;

  //PIF WEB VIEW
  const modalizeRef = React.useRef(null);
  const webViewRef = React.useRef(null);

  const moviesAPI = useApi(movies.getMovies);
  const voteAPI = useApi(vote.castVote);
  var isFetchingNextMovieSet = false;
  useShakeDetection(() => {
    if (isInShake) {
      return;
    }
    const isFocused = navigation.isFocused();
    if (isFocused) {
      if (previousVote.order && previousVote.direction) {
        isInShake = true;
        Alert.alert(
          i18n.t("Undolastswipe"),
          "",
          [
            {
              text: i18n.t("Cancel"),
              onPress: () => {
                isInShake = false;
              },
            },
            {
              text: i18n.t("OK"),

              onPress: async () => {
                setIndex(index - 1);
                setLoading(true);
                await swiperRef.current.swipeBack(() => {
                  setLoading(false);
                });
                previousVote = {};
                isInShake = false;
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        isInShake = true;
        Alert.alert(
          i18n.t("Noundoisavaliable"),
          "",
          [
            {
              text: i18n.t("Cancel"),
              onPress: () => {
                isInShake = false;
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  });

  async function checkChat(showLoad = true, force = false) {
    if (showLoad) {
      setLoading(true);
    }
    let response;
    if (!force) {
      response = await cache.getData(
        "FLIXPIX::" + groupInformation.groupID + "::messages",
        true,
        1
      );
      if (!response || !response.data || !response.data.chat) {
        response = await chatAPI.request(groupInformation.groupID);
        if (!response.data || !response.data.chat) {
          Alert.alert(i18n.t("Network Error"));
          setLoading(false);
          return;
        }
        cache.storeData(
          "FLIXPIX::" + groupInformation.groupID + "::messages",
          response
        );
      }
    } else {
      response = await chatAPI.request(groupInformation.groupID);
      if (!response.data || !response.data.chat) {
        Alert.alert(i18n.t("Network Error"));
        setLoading(false);
        return;
      }
      cache.storeData(
        "FLIXPIX::" + groupInformation.groupID + "::messages",
        response
      );
    }
    if (response.data && response.data.chat) {
      const reverseMessages = response.data.chat.Items.reverse();
      if (showLoad) {
        setLoading(false);
      }
      if (
        reverseMessages.length > 0 &&
        reverseMessages[reverseMessages.length - 1].Message &&
        reverseMessages[reverseMessages.length - 1].SenderID
      ) {
        const lastTag = await cache.getData(
          "FLIXPIX::" + groupInformation.groupID + "::lastMessage",
          false
        );
        if (
          !lastTag ||
          lastTag !==
            reverseMessages[reverseMessages.length - 1].Message +
              reverseMessages[reverseMessages.length - 1].SenderID
        ) {
          setChatNotification(true);
        }
      }
    }
  }

  React.useEffect(() => {
    if (groupInformation.startJoin) {
      setShareVisible(true);
    }
    previousVote = {};
    handOffMovies = [];
    getMovies();
    const setSuper = async () => {
      firstSwipe = true;
      const num = await cache.getData(
        "FLIXPIX::" + groupInformation.groupID + "::superlikes",
        false
      );
      if (num == null) {
        cache.storeData(
          "FLIXPIX::" + groupInformation.groupID + "::superlikes",
          2
        );
        setNumSuperLikes(2);
      } else {
        setNumSuperLikes(num);
      }
    };
    setSuper();
    checkChat(false, true);
  }, []);

  async function getMovies(forceLoad = false) {
    const currentIndex = await cache.getData(
      "FLIXPIX::" + groupInformation.groupID + "::index",
      false
    );
    const page = Math.ceil((currentIndex + 1) / 20);
    setIndex(currentIndex % 20);
    const movieStack = await cache.getData(
      "FLIXPIX::" + groupInformation.groupID + "::MOVIE_BATCH=" + page,
      false
    );
    if (!movieStack) {
      const nextMovieStack = await callAndStore(page);
      loadInNextCardStack(nextMovieStack);
    } else {
      setMovieArray(movieStack.length ? movieStack : []);
      if (forceLoad || currentIndex % 20 == 0) {
        loadInNextCardStack(movieStack);
      }
    }
  }

  const castLikeToCache = async (index, direction) => {
    if (direction === "likes" || direction === "superlikes") {
      let likeArray = await cache.getData(
        "FLIXPIX::" + groupInformation.groupID + "::likes",
        false
      );
      likeArray = likeArray ? likeArray : [];
      const isSuperLike = direction === "superlikes";
      const nextMovie = { ...movieArray[index], superlike: isSuperLike };
      likeArray.push(nextMovie);

      await cache.storeData(
        "FLIXPIX::" + groupInformation.groupID + "::likes",
        likeArray
      );

      let personalLikes = await cache.getData("FLIXPIX::likes");
      personalLikes = personalLikes ? personalLikes : [];
      let found = false;
      for (var i = 0; i < personalLikes.length; i++) {
        if (personalLikes[i].id === nextMovie.id) {
          found = true;
          break;
        }
      }
      if (!found) {
        personalLikes.push({ ...nextMovie, type: groupInformation.type });
        cache.storeData("FLIXPIX::likes", personalLikes);
      }
    }
  };

  const callAndStore = async (requestPage) => {
    const nextBatchMovieData = await moviesAPI.request(
      requestPage - 1,
      groupInformation.groupID
    );

    await cache.storeData(
      "FLIXPIX::" + groupInformation.groupID + "::MOVIE_BATCH=" + requestPage,
      nextBatchMovieData.data.shows
    );
    return nextBatchMovieData.data.shows;
  };

  const getNextMovie = async (index) => {
    if (isFetchingNextMovieSet) {
      return;
    }
    if (handOffMovies.length > 0) {
      if (index == 19) {
        await loadInNextCardStack(handOffMovies);
        setLoading(false);
        handOffMovies = [];
      }
      return;
    }
    isFetchingNextMovieSet = true;
    const currentIndex = await cache.getData(
      "FLIXPIX::" + groupInformation.groupID + "::index",
      false
    );
    const nextPage = Math.ceil((currentIndex + 1) / 20) + 1;
    const nextBatch = await cache.getData(
      "FLIXPIX::" + groupInformation.groupID + "::MOVIE_BATCH=" + nextPage,
      false
    );
    if (nextBatch) {
      //batch exists!
      handOffMovies = nextBatch;
      if (index == 19) {
        await loadInNextCardStack(nextBatch);
        setLoading(false);
        handOffMovies = [];
      }
      isFetchingNextMovieSet = false;
      return;
    }
    //do api call, store the data.
    const nextBatchMovieData = await moviesAPI.request(
      nextPage - 1,
      groupInformation.groupID
    );
    if (
      !nextBatchMovieData ||
      !nextBatchMovieData.data ||
      !nextBatchMovieData.data.shows
    ) {
      return;
    }
    await cache.storeData(
      "FLIXPIX::" + groupInformation.groupID + "::MOVIE_BATCH=" + nextPage,
      nextBatchMovieData.data.shows
    );
    handOffMovies = nextBatchMovieData.data.shows;
    if (index == 19) {
      await loadInNextCardStack(nextBatchMovieData.data.shows);
      setLoading(false);
      handOffMovies = [];
    }
    isFetchingNextMovieSet = false;
  };

  const loadInNextCardStack = async (newArray = []) => {
    if (newArray.length == 0) {
      setEndOfStack(true);
      return;
    }
    setLoading(false);
    setMovieArray(newArray);
    setTimeout(function () {
      if (!endOfStack) swiperRef.current.jumpToCardIndex(0);
    }, 100);
  };

  const checkFirstTimeSwiping = async (direction) => {
    if (Platform.OS === "android") {
      return;
    }
    if (
      direction === "likes" &&
      !(await cache.getData("FLIXPIX::HAS_LIKED", false))
    ) {
      await swiperRef.current.swipeBack();
      cache.storeData("FLIXPIX::HAS_LIKED", true);
      Alert.alert(
        i18n.t("Like what you see"),
        i18n.t("Srtvy"),
        [
          {
            text: "CANCEL",
            onPress: () => {},
          },
          {
            text: "LIKE",
            onPress: () => {
              swiperRef.current.swipeRight();
            },
          },
        ],
        { cancelable: false }
      );
      return true;
    }
    if (
      direction === "dislikes" &&
      !(await cache.getData("FLIXPIX::HAS_DISLIKED", false))
    ) {
      await swiperRef.current.swipeBack();
      cache.storeData("FLIXPIX::HAS_DISLIKED", true);
      Alert.alert(
        i18n.t("Not interested"),
        i18n.t("SLIYNIN"),
        [
          {
            text: i18n.t("Cancel"),
            onPress: () => {},
          },
          {
            text: i18n.t("NOT INTERESTED"),
            onPress: () => {
              swiperRef.current.swipeLeft();
            },
          },
        ],
        { cancelable: false }
      );
      return true;
    }
    if (
      direction === "superlikes" &&
      !(await cache.getData("FLIXPIX::HAS_SUPERLIKED", false))
    ) {
      await swiperRef.current.swipeBack();
      cache.storeData("FLIXPIX::HAS_SUPERLIKED", true);
      Alert.alert(
        i18n.t("Is this one of your top pick"),
        i18n.t("MakeITCountt"),
        [
          {
            text: i18n.t("Cancel"),
            onPress: () => {},
          },
          {
            text: i18n.t("TopPick"),
            onPress: () => {
              swiperRef.current.swipeTop();
            },
          },
        ],
        { cancelable: false }
      );
      return true;
    }
    if (
      direction === "indifferents" &&
      !(await cache.getData("FLIXPIX::HAS_PASSED", false))
    ) {
      await swiperRef.current.swipeBack();
      cache.storeData("FLIXPIX::HAS_PASSED", true);
      Alert.alert(
        i18n.t("No opinion"),
        i18n.t("Swipedowntopass"),
        [
          {
            text: i18n.t("Cancel"),
            onPress: () => {},
          },
          {
            text: i18n.t("PASS"),
            onPress: () => {
              swiperRef.current.swipeBottom();
            },
          },
        ],
        { cancelable: false }
      );
      return true;
    }
    return false;
  };

  const checkMatches = async () => {
    const response = await statsAPI.request(groupInformation.groupID);
    if (!response.data || !response.data.Items) {
      Alert.alert(i18n.t("Network Error"));
      setLoading(false);
      return;
    }
    cache.storeData(
      "FLIXPIX::" + groupInformation.groupID + "::full_scan",
      response
    );
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
    const sliced = filtered.slice(0, 5);

    const prevTitles = await cache.getData(
      "FLIXPIX::" + groupInformation.groupID + "::top5titles",
      false
    );

    if (prevTitles) {
      for (let i = 0; i < prevTitles.length; ++i) {
        let hasBeenFound = false;
        for (let j = 0; j < sliced.length; ++j) {
          if (sliced[j].title) {
            if (sliced[j].title === prevTitles[i]) {
              hasBeenFound = true;
            }
          } else if (sliced[j].name) {
            if (sliced[j].name === prevTitles[i]) {
              hasBeenFound = true;
            }
          }
        }
        if (!hasBeenFound) {
          setRankNotification(true);
        }
      }
    } else {
      if (sliced.length > 0) {
        setRankNotification(true);
      }
      const namesArray = [];
      for (let i = 0; i < sliced.length; ++i) {
        namesArray.push(sliced[i].name || sliced[i].title);
      }
      cache.storeData(
        "FLIXPIX::" + groupInformation.groupID + "::top5titles",
        namesArray
      );
    }
  };

  const onSwiped = async (data) => {
    if (Platform.OS === "ios") Haptics.selectionAsync();
    //set to vote for last swipe, change to undo
    if (data.index % 9 == 0) {
      checkMatches();
    }

    if (await checkFirstTimeSwiping(data.direction)) {
      return;
    }
    if (firstSwipe) {
      setShowStar(false);
      setTimeout(() => {
        setShowStar(true);
      }, 2000);
      firstSwipe = false;
    }

    if (data.direction == "superlikes") {
      if (numSuperLikes == 0) {
        swiperRef.current.swipeBack();
        if (Platform.OS === "ios") Haptics.notificationAsync();
        Alert.alert(i18n.t("All out of top picks"));
        setShowStar(false);
        setTimeout(() => {
          setShowStar(true);
        }, 2000);
        return;
      } else {
        cache.storeData(
          "FLIXPIX::" + groupInformation.groupID + "::superlikes",
          numSuperLikes - 1
        );
        setNumSuperLikes(numSuperLikes - 1);
        setShowStar(false);
        setTimeout(() => {
          setShowStar(true);
        }, 2000);
      }
    }
    if (data.index > -1 && data.index < 21) {
      if (data.direction) {
        setNotificationType({
          type: data.direction,
          index: data.index + Math.random(),
        });
      }
      if (movieArray[data.index]) {
        if (data.index == 20) {
          castLikeToCache(data.index, data.direction);
          castVote(movieArray[data.index].order, data.direction);
          if (previousVote.order) {
            castVote(previousVote.order, previousVote.direction);
            castLikeToCache(previousVote.index, previousVote.direction);
          }
          previousVote = {};
        } else {
          if (previousVote.order && previousVote.direction) {
            castVote(previousVote.order, previousVote.direction);
            castLikeToCache(previousVote.index, previousVote.direction);
          }
          previousVote = {
            index: data.index,
            order: movieArray[data.index].order,
            direction: data.direction,
          };
        }
      }
      checkForRating();
    }

    if (data.index + 1 >= 10) {
      getNextMovie(data.index);
    }
    if (data.index + 1 == 20) {
      setLoading(true);
      const storedIndex = await cache.getData(
        "FLIXPIX::" + groupInformation.groupID + "::index",
        false
      );
      await cache.storeData(
        "FLIXPIX::" + groupInformation.groupID + "::index",
        storedIndex % 20 == 0
          ? storedIndex
          : storedIndex + 20 - (storedIndex % 20)
      );
    } else {
      const storedIndex = await cache.getData(
        "FLIXPIX::" + groupInformation.groupID + "::index",
        false
      );
      await cache.storeData(
        "FLIXPIX::" + groupInformation.groupID + "::index",
        storedIndex + 1
      );
    }
    // setIndex((index + 1) % movieArray.length);
  };

  const castVote = async (movieID, voteType) => {
    await voteAPI
      .request(movieID, groupInformation.groupID, voteType)
      .then((data) => {
        if (data && data.data && data.data.numMembers) {
          cache.storeData(
            "FLIXPIX::" + groupInformation.groupID + "::numMembers",
            data.data.numMembers
          );
        }
        if (data && data.data && data.data.matched) {
          setMatchTitle(data.data.title);
          setMatchPoster(data.data.poster);
          setMatchVisible(true);
        }
      });
  };

  return (
    <View style={styles.container}>
      <Header
        rankNotificaiton={rankNotification}
        backVisible={true}
        rankVisible={true}
        chatVisible={true}
        chatNotification={chatNotification}
        groupInfoVisbleFar={true}
        onHeartPress={() => modalizeRef.current.open()}
        onBackPress={() => {
          if (previousVote.order) {
            castVote(previousVote.order, previousVote.direction);
            castLikeToCache(previousVote.index, previousVote.direction);
          }
          previousVote = {};
          navigation.navigate("Landing");
        }}
        onGroupInfoPress={() => {
          setShareVisible(true);
        }}
        onChatPress={() => {
          setChatNotification(false);
          navigation.navigate("Chat", {
            groupID: groupInformation.groupID,
            name: groupInformation.name,
          });
        }}
        onRankPress={async () => {
          if (previousVote.order) {
            castVote(previousVote.order, previousVote.direction);
            await castLikeToCache(previousVote.index, previousVote.direction);
          }
          previousVote = {};
          setRankNotification(false);
          navigation.navigate("Stats", {
            groupID: groupInformation.groupID,
            providers: groupInformation.providersString,
            type: groupInformation.type,
          });
        }}
      />
      <MaterialCommunityIcons
        name="crop-square"
        size={width}
        color={colors.greenHeart}
        style={{
          opacity: 0.05,
          transform: [{ rotate: "45deg" }, { scale: 1.6 }],
          position: "absolute",
          left: 0,
          top: 0,
        }}
      />
      {!endOfStack && (
        <View style={{ width: "100%", height: "100%" }}>
          {movieArray.length > 0 && (
            <Swiper
              ref={swiperRef}
              cards={movieArray}
              cardIndex={index}
              cardVerticalMargin={10}
              renderCard={(card) => (
                <View>
                  <Card
                    card={card}
                    groupInformation={groupInformation}
                    onPress={() => {
                      setCurrentCard(card);
                      modalizeRef.current.open();
                    }}
                  />
                </View>
              )}
              infinite={false}
              backgroundColor={"transparent"}
              onSwipedLeft={(index) => {
                onSwiped({ index, direction: "dislikes" });
              }}
              onSwipedBottom={(index) => {
                onSwiped({ index, direction: "indifferents" });
              }}
              onSwipedTop={(index) => {
                onSwiped({ index, direction: "superlikes" });
              }}
              onSwipedRight={(index) => {
                onSwiped({ index, direction: "likes" });
              }}
              stackSize={stackSize}
              stackScale={10}
              stackSeparation={14}
              animateOverlayLabelsOpacity
              animateCardOpacity={false}
              overlayOpacityHorizontalThreshold={10000}
              overlayOpacityVerticalThreshold={10000}
              //horizontalThreshold={width / 10}
              overlayLabels={{
                left: {
                  title: "NOPE",
                  style: {
                    label: {
                      backgroundColor: colors.red,
                      borderColor: colors.red,
                      color: colors.white,
                      borderWidth: 1,
                      fontSize: 24,
                    },
                    wrapper: {
                      flexDirection: "column",
                      alignItems: "flex-end",
                      justifyContent: "flex-start",
                      marginTop: 20,
                      marginLeft: -20,
                    },
                  },
                },
                top: {
                  title: "TOP PICK",
                  style: {
                    label: {
                      backgroundColor: colors.yellow,
                      borderColor: colors.yellow,
                      color: colors.white,
                      borderWidth: 1,
                      fontSize: 24,
                    },
                    wrapper: {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      marginTop: "100%",
                      marginLeft: 20,
                    },
                  },
                },
                bottom: {
                  title: "MEH",
                  style: {
                    label: {
                      backgroundColor: colors.gray,
                      borderColor: colors.gray,
                      color: colors.white,
                      borderWidth: 1,
                      fontSize: 24,
                    },
                    wrapper: {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      marginTop: 20,
                      marginLeft: 20,
                    },
                  },
                },
                right: {
                  title: "LIKE",
                  style: {
                    label: {
                      backgroundColor: colors.greenHeart,
                      borderColor: colors.greenHeart,
                      color: colors.white,
                      borderWidth: 1,
                      fontSize: 24,
                    },
                    wrapper: {
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      marginTop: 20,
                      marginLeft: 20,
                    },
                  },
                },
              }}
            />
          )}
        </View>
      )}
      {!endOfStack && (
        <View style={styles.bottomContainer}>
          <View style={styles.bottomContainerButtons}>
            <TouchableOpacity
              style={{
                backgroundColor: colors.fg16,
                width: 60,
                height: 60,
                borderRadius: 60,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                elevation: 4,
                shadowOpacity: 0.2,
                shadowRadius: 7,
                display: "flex",
                justifyContent: "center",
              }}
              onPress={() => {
                if (!loading) {
                  swiperRef.current.swipeLeft();
                }
              }}
            >
              <Entypo
                name="cross"
                size={45}
                style={{ alignSelf: "center" }}
                backgroundColor="transparent"
                underlayColor="transparent"
                activeOpacity={0.3}
                color={colors.red}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: colors.fg16,
                width: 60,
                height: 60,
                borderRadius: 60,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                elevation: 4,
                shadowOpacity: 0.2,
                shadowRadius: 7,
                display: "flex",
                justifyContent: "center",
              }}
              onPress={() => {
                if (!loading) {
                  swiperRef.current.swipeTop();
                }
              }}
            >
              {showStar && (
                <FontAwesome
                  name="star"
                  size={29}
                  style={{ alignSelf: "center", paddingTop: 2 }}
                  backgroundColor="transparent"
                  underlayColor="transparent"
                  activeOpacity={0.3}
                  color={colors.yellow}
                />
              )}
              {!showStar && (
                <AppText
                  style={{
                    alignSelf: "center",
                    paddingTop: 2,
                    color: colors.yellow,
                    fontWeight: "900",
                    fontSize: 32,
                  }}
                >
                  {numSuperLikes}
                </AppText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: colors.fg16,
                width: 60,
                height: 60,
                borderRadius: 60,
                elevation: 4,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.2,
                shadowRadius: 7,
                display: "flex",
                justifyContent: "center",
              }}
              onPress={() => {
                if (!loading) {
                  swiperRef.current.swipeRight();
                }
              }}
            >
              <AntDesign
                name="heart"
                size={29}
                style={{ alignSelf: "center", paddingTop: 2 }}
                backgroundColor="transparent"
                underlayColor="transparent"
                activeOpacity={0.3}
                color={colors.greenHeart}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
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
        <FadeNotificaiton renderIndex={notificationType.index}>
          {toastConfig[notificationType.type]}
        </FadeNotificaiton>
      </View>
      <View pointerEvents="box-none" style={styles.motalScreenDiv}>
        <Modal animationType="fade" transparent={true} visible={shareVisible}>
          <ShareScreen
            onClose={() => {
              setShareVisible(false);
            }}
            groupName={groupInformation.name}
            groupID={groupInformation.groupID}
          ></ShareScreen>
        </Modal>
      </View>
      <View pointerEvents="box-none" style={styles.motalScreenDiv}>
        <Modal animationType="slide" transparent={true} visible={matchVisible}>
          <View
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: colors.white,
            }}
          >
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                alignSelf: "center",
                alignContent: "center",
                height: "100%",
                width: "100%",
                backgroundColor: "rgba(0,0,0,.05)",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  width: "80%",
                  height: "100%",
                  display: "flex",

                  alignSelf: "center",
                }}
              >
                <View style={{ height: "5%" }}></View>
                <View
                  style={{
                    justifyContent: "center",
                    height: "30%",
                  }}
                >
                  <AppText
                    style={{
                      textAlign: "center",
                      fontSize: 40,
                      fontWeight: "900",
                      color: colors.primary,
                    }}
                  >
                    {i18n.t("It'sAMatch")}
                  </AppText>
                </View>
                {matchPoster != null && (
                  <Image
                    source={{
                      uri: "https://image.tmdb.org/t/p/w342" + matchPoster,
                    }}
                    style={{
                      width: "100%",
                      height: "37%",
                      resizeMode: "contain",
                    }}
                  />
                )}
              </View>
              <LottieView
                autoPlay
                style={{
                  height: Platform.OS === "ios" ? "100%" : 600,
                }}
                resizeMode="cover"
                loop={true}
                source={require("../assets/animations/confetti.json")}
              />
            </View>
            <AppButton
              onPress={() => {
                if (Platform.OS === "ios") Haptics.notificationAsync();
                setMatchVisible(false);
              }}
              style={{ position: "absolute", bottom: 35 }}
              color="primary"
              title="CONTINUE SWIPING"
            />
          </View>
        </Modal>
      </View>
      {loading && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            alignSelf: "center",
            alignContent: "center",
            height: "100%",
            backgroundColor: "rgba(0,0,0,.2)",
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
      {endOfStack && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            alignSelf: "center",
            alignContent: "center",
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0,0,0,.05)",
            justifyContent: "center",
          }}
        >
          <LottieView
            autoPlay
            style={{
              height: 350,
            }}
            resizeMode="cover"
            loop={true}
            source={require("../assets/animations/space_cow.json")}
          />
          <View
            style={{
              position: "absolute",
              bottom: 200,
              width: "70%",
              display: "flex",
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <AppText
              style={{
                textAlign: "center",
                fontSize: 18,
                color: colors.primaryText,
              }}
            >
              {i18n.t("Youveswipedthroughallthecontentinyourcurrentfilters")}
            </AppText>
          </View>
        </View>
      )}
      <Modalize
        ref={modalizeRef}
        modalHeight={Math.floor(Dimensions.get("window").height * 0.85)}
        handlePosition="inside"
        modalStyle={{ backgroundColor: colors.fg06 }}
        childrenStyle={{
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* <WebView
          ref={webViewRef}
          source={{
            uri: "https://www.buymeacoffee.com/flixpix",
          }}
          style={{ height: Dimensions.get("window").height * 0.85 }}
        /> */}
        <MoreMovieInfo
          {...currentCard}
          providers={groupInformation.providersString}
          type={groupInformation.type}
          onSimilarMovie={(movie) => {
            setCurrentCard(movie);
          }}
        ></MoreMovieInfo>
      </Modalize>
    </View>
  );
}

const styles = StyleSheet.create({
  motalScreenDiv: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  swiperContainer: {
    flex: 0.8,
  },
  bottomContainer: {
    height: 95,
    bottom: 0,
    position: "absolute",
    width: "100%",
    justifyContent: "space-evenly",
  },
  bottomContainerMeta: { alignContent: "flex-end", alignItems: "center" },
  bottomContainerButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    //alignContent: "center",
    alignItems: "center",
  },
  cardImage: {
    height: "100%",
    top: -6,
    resizeMode: "contain", //center, contain, cover, repeat, stretch
  },
  card: {
    // flex: 0.7,
    width: cardWidth,
    height: cardHeight,
    borderRadius: 8,
    shadowRadius: 10,
    shadowColor: colors.black,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: "#0000",
    elevation: 10,
    overflow: "visible",
    alignSelf: "center",
    justifyContent: "center",
    // backgroundColor: colors.fg06,
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
  done: {
    textAlign: "center",
    fontSize: 30,
    color: colors.white,
    backgroundColor: "transparent",
  },
  heading: {
    fontSize: 24,
    marginBottom: 0,
    color: colors.AATextDARK,
    textAlign: "left",
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowRadius: 5,
  },
  price: {
    paddingTop: 7,
    fontSize: 15,
    color: colors.AAText,
    fontWeight: "400",
    textAlign: "left",
  },
});

export default SwipeScreen;
