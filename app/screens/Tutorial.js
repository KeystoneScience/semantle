import React, { useRef } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
  ImageBackground,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import i18n from "i18n-js";
import translate from "../config/translate";
import { LinearGradient } from "expo-linear-gradient";
import Swiper from "react-native-deck-swiper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import useApi from "../hooks/useApi";
import ShareScreen from "./ShareScreen";
import Header from "../components/Header";
import colors from "../config/colors";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import AppText from "../components/Text";
import CardFlip from "react-native-card-flip";
import LottieView from "lottie-react-native";
import Fade from "../components/Fade";
import useShakeDetection from "../hooks/useShakeDetection";
import FadeNotificaiton from "../components/FadeNotification";
import Constants from "expo-constants";
import analytics from "../utility/analytics";

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

const cardArray = [
  {
    title: i18n.t("WelcometoFlixPix"),
    description: i18n.t("swipeanydirectiontocontinue"),
    back_title: i18n.t("SwipeToContinue"),
  },
  {
    title: i18n.t("Swiperighttovoteforashow"),
    description: "",
    animation: require("../assets/animations/swipe_right.json"),
    back_title: i18n.t("SwipeToContinue"),
  },
  {
    title: i18n.t("Swipelefttovoteagainstashow"),
    description: "",
    animation: require("../assets/animations/swipe_left.json"),
    back_title: i18n.t("SwipeToContinue"),
  },
  {
    title: i18n.t("Swipedowntopassonashow"),
    description: "",
    animation: require("../assets/animations/swipe_down.json"),
    back_title: i18n.t("SwipeToContinue"),
  },
  {
    title: i18n.t("SwipeuptochooseashowasyourTopPick"),
    //description: "you only have 2 of these per group, so use them well!",
    animation: require("../assets/animations/swipe_up.json"),
    back_title: i18n.t("SwipeToContinue"),
  },
  {
    title: i18n.t("Shakeyourphonetoundoyourlastswipe"),
    description: i18n.t("orswipetocontinue"),
    animation: require("../assets/animations/shake.json"),
    back_title: i18n.t("SwipeToContinue"),
    shake: true,
  },
  {
    title: i18n.t("Taponacardtogetmoreinformation"),
    animation: require("../assets/animations/tap.json"),
    back_title: i18n.t(
      "MovieTriviaFactTotowaspaidmorethantheMunchkinsinTheWizardofOz"
    ),
    back_description: i18n.t(
      "TheMunchkinactorsreceived50aweekwhichwasagoodwageatthetimewhilethedogearned125aweek"
    ),
    back_animation: require("../assets/animations/dog.json"),
  },
  {
    moreInfo: true,
    title: i18n.t("OtherInfo"),
    description: "",
    animation_size: 180,
    back_title: "",
    back_description: "",
  },
  {
    title: i18n.t("Whatarewewatchingtonight"),
    description: i18n.t("Makeorjoinagroupandtakethehassleoutofmovienight"),
    animation: require("../assets/animations/group.json"),
    animation_size: 180,
    back_title: i18n.t("Whatareyouwaitingfor"),
    back_description: "",
  },
  {},
  {},
  {},
];

const Card = ({ card }) => {
  if (!card || !card.title) {
    return <View></View>;
  }

  var cardRef = useRef();

  return (
    <CardFlip style={styles.card} ref={(card) => (cardRef = card)}>
      <TouchableWithoutFeedback
        delayPressIn={0}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.primary,
          borderRadius: 5,
          overflow: "hidden",
        }}
        onPress={() => cardRef.flip()}
      >
        <View
          style={{
            backgroundColor: colors.primary,
            width: "100%",
            height: "100%",
            borderRadius: 5,
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            padding: 10,
            alignItems: "center",
          }}
        >
          {!card.moreInfo && (
            <AppText
              style={{
                color: colors.white,
                fontSize: 30,
                fontWeight: "800",
                textAlign: "center",
              }}
            >
              {card.title}
            </AppText>
          )}

          {card.moreInfo && (
            <View
              style={{
                display: "flex",
                justifyContent: "flex-start",
                height: "100%",
                alignItems: "center",
              }}
            >
              <AppText
                style={{
                  color: colors.white,
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: 30,
                  paddingBottom: 50,
                  paddingTop: 10,
                }}
              >
                {i18n.t("OtherInfo")}
              </AppText>
              <FontAwesome name="heart" size={34} color={colors.white} />
              <AppText
                style={{
                  color: colors.white,
                  textAlign: "center",
                  padding: 10,
                }}
              >
                {i18n.t("RankingExplaination")}
              </AppText>
              <View style={{ marginTop: 50 }} />
              <FontAwesome5 name="user-plus" size={30} color={colors.white} />
              <AppText
                style={{
                  color: colors.white,
                  textAlign: "center",
                  padding: 10,
                }}
              >
                {i18n.t("ShareExplainations")}
              </AppText>
              <View
                style={{
                  position: "absolute",
                  bottom: 30,
                }}
              >
                <AppText style={{ color: colors.white }}>
                  {i18n.t("SwipeToContinue")}
                </AppText>
              </View>
            </View>
          )}
          <AppText
            style={{
              color: colors.white,
              fontSize: 15,
              fontWeight: "400",
              textAlign: "center",
            }}
          >
            {card.description}
          </AppText>
          {card.animation && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                alignSelf: "center",
                alignContent: "flex-end",
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <LottieView
                autoPlay
                style={{
                  height: card.animation_size ? card.animation_size : 150,
                  paddingLeft: card.animation_pad ? card.animation_pad : 0,
                }}
                resizeMode="cover"
                loop={true}
                source={card.animation}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>

      <TouchableWithoutFeedback
        delayPressIn={0}
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: colors.secondary,
          borderRadius: 5,
          overflow: "hidden",
        }}
        onPress={() => cardRef.flip()}
      >
        <View
          style={{
            backgroundColor: colors.secondary,
            width: "100%",
            height: "100%",
            borderRadius: 5,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            padding: 10,
          }}
        >
          <AppText
            style={{
              color: colors.white,
              fontSize: 30,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            {card.back_title}
          </AppText>
          <AppText
            style={{
              color: colors.white,
              fontSize: 15,
              fontWeight: "400",
              textAlign: "center",
            }}
          >
            {card.back_description}
          </AppText>
          {card.back_animation && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                alignSelf: "center",
                alignContent: "flex-end",
                height: "100%",
                justifyContent: "flex-end",
              }}
            >
              <LottieView
                autoPlay
                style={{
                  height: 150,
                }}
                resizeMode="cover"
                loop={true}
                source={card.back_animation}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </CardFlip>
  );
};

var maySwipeBack = false;
var isInShake = false;

function Tutorial({ navigation, route }) {
  const [index, setIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [notificationType, setNotificationType] = React.useState({
    type: "blank",
    index: 0,
  });
  useShakeDetection(() => {
    if (isInShake) {
      return;
    }
    const isFocused = navigation.isFocused();
    if (isFocused) {
      if (maySwipeBack) {
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
                maySwipeBack = false;
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

  const onSwiped = async (data) => {
    analytics.logEvent("TUTORIAL SWIPE","","Tutorial",data.index)
    maySwipeBack = true;
    if (data.index > 7) {
      navigation.navigate("Landing");
    }
    if (data.direction) {
      setNotificationType({
        type: data.direction,
        index: data.index + Math.random(),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Header
        backVisible={false}
        onBackPress={() => {
          navigation.navigate("Landing");
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
      {/* <StatusBar hidden={true} /> */}
      <View style={{ width: "100%", height: "100%" }}>
        <Swiper
          ref={swiperRef}
          cards={cardArray}
          cardIndex={index}
          cardVerticalMargin={10}
          renderCard={(card) => (
            <View>
              <Card card={card} />
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
          overlayOpacityHorizontalThreshold={10000} //FIXME, out until constant fade, no new render
          overlayOpacityVerticalThreshold={10000}
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
      </View>
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
      <View style={styles.bottomContainer}>
        <View style={styles.bottomContainerButtons}>
          <TouchableOpacity
            style={{
              backgroundColor: colors.fg16,
              width: 60,
              height: 60,
              borderRadius: 60,
              shadowColor: "#000",
              elevation: 4,
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
              swiperRef.current.swipeLeft();
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
              elevation: 4,
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
              swiperRef.current.swipeTop();
            }}
          >
            <FontAwesome
              name="star"
              size={29}
              style={{ alignSelf: "center", paddingTop: 2 }}
              backgroundColor="transparent"
              underlayColor="transparent"
              activeOpacity={0.3}
              color={colors.yellow}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: colors.fg16,
              width: 60,
              height: 60,
              borderRadius: 60,
              shadowColor: "#000",
              elevation: 4,
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
              swiperRef.current.swipeRight();
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
    backgroundColor: "#0000",
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
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

export default Tutorial;
