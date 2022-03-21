import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import AppButton from "../../components/AppButton";
import Fade from "../../components/Fade";
import Header from "../../components/Header";
import { ScrollView, Modal } from "react-native";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import FilterGroup from "./filterGroup/FilterGroup";
import PillFilterGroup from "./filterGroup/PillFilterGroup";
import filters from "../../config/filters";
import group from "../../api/group";
import cache from "../../utility/cache";
import LottieView from "lottie-react-native";
import useApi from "../../hooks/useApi";
import { updateId } from "expo-updates";
import i18n from "i18n-js";
import translate from "../../config/translate";
import * as Localization from "expo-localization";
import * as Haptics from "expo-haptics";
var providers = [];
var groupName = "";

function CreateGroupScreen({ navigation, route }) {
  const [type, setType] = useState("movie");
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState("US");
  const [nameerror, setnameerror] = useState(false);
  
  const [ratitingsSystem, setRatingsSystem] = useState("US");
  const genres = [];
  const tvGenres = [];
  const ratings = [];
  const tvRatings = [];
  //const [groupName, setGroupName] = useState("movie");

  useEffect(() => {
    const setCountryCode = async () => {
      let cc = await cache.getData("FLIXPIX::DEFAULT_REGION", false);
      if (cc) {
        setRegion(cc);
      }
    };
    setCountryCode();
  }, []);

  const postCreateGroup = useApi(group.makeGroup);
  function createGroup() {
    if (groupName === "") {
      if (Platform.OS === "ios") Haptics.notificationAsync();
      Alert.alert(i18n.t("enter a group name"));
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      setnameerror(true);
      return;
    }
    setLoading(true);
    if (groupName.length > 300) {
      groupName = groupName.substring(0, 300);
    }

    postCreateGroup
      .request(
        groupName,
        {
          providers,
          genres: type === "movie" ? genres : tvGenres,
          type,
          ratings: type === "movie" ? ratings : tvRatings,
        },
        route.params.screenName ? route.params.screenName : "~",
        route.params.pushToken ? route.params.pushToken : null,
        region,
        ratitingsSystem,
        Localization.locale
      )
      .then(async (data) => {
        // Object {
        //   "group": Object {
        //     "created": 1615966117702,
        //     "genresString": "28|35|80|99|16",
        //     "groupID": "2749db4a-e91e-4d5f-888e-407f01340bd3",
        //     "name": "asdfs",
        //     "numMembers": 1,
        //     "type": "movie",
        //   },
        //   "joinCode": "N228378",
        //   "page": 1,
        //   "results": Array [
        //     Object {
        //       "adult": false, ...
        if (!data.data.shows) {
          Alert.alert(i18n.t("An error occured"));
          setLoading(false);
          return;
        }
        if (data.data.shows.length < 19) {
          Alert.alert(i18n.t("No enough shows found under current filters"));
          setLoading(false);
          return;
        }
        const storeData = { ...data.data.group, isOwner: true };
        var groups = await cache.getData("FLIXPIX::GROUPS", false);
        groups = groups ? groups : [];
        groups.push(storeData);
        cache.storeData("FLIXPIX::GROUPS", groups);
        await cache.storeData(
          "FLIXPIX::" + data.data.group.groupID + "::MOVIE_BATCH=1",
          data.data.shows
        );
        cache.storeData(
          "FLIXPIX::" + data.data.group.groupID + "::numMembers",
          1
        );
        await cache.storeData(
          "FLIXPIX::" + data.data.group.groupID + "::JOIN_CODE",
          data.data.joinCode
        );
        setLoading(false);
        navigation.navigate("Swipe", { ...storeData, startJoin: true }); //groupMovie.ownerID === });
        //navigation.navigate("Landing");
      });
  }

  React.useEffect(() => {
    providers = [];
    groupName = "";
  }, []);
  const scrollRef = useRef();
  return (
    <TouchableWithoutFeedback
      onPressIn={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={{ flex: 1 }}>
        <Header
          backVisible={true}
          regionInfooVisible={true}
          defaultCountry={region}
          onRegionSelect={(code, country) => {
            cache.storeData("FLIXPIX::DEFAULT_REGION", code);
            if (type === "movie") {
              if (filters.ratings.movie_certifications[code]) {
                setRegion(code);
                setRatingsSystem(code);
              } else {
                setRatingsSystem("US");
              }
            } else {
              if (filters.ratings.tv_certifications[code]) {
                setRegion(code);
                setRatingsSystem(code);
              } else {
                setRatingsSystem("US");
              }
            }
          }}
          onBackPress={() => {
            navigation.navigate("Landing");
          }}
        />
        <ScrollView
          style={{
            overflow: "visible",
            flex: 0.9,
          }}
          keyboardDismissMode="on-drag"
          ref={scrollRef}
        >
          <TextInput
            style={[styles.input,{borderWidth:nameerror? 2: 0}]}
            underlineColorAndroid="transparent"
            placeholder={i18n.t("GroupName")}
            placeholderTextColor={nameerror? colors.secondary: colors.AAText}
            autoCapitalize="none"
            onChangeText={(text) => {
              groupName = text;
            }}
          />
          <View style={{height:120}}>
          <Fade>
          <FilterGroup
            onSelect={(obj) => {
              if (Platform.OS === "ios") Haptics.selectionAsync();
              setType(obj.id);
            }}
            groupName={i18n.t("Type")}
            groupData={filters.type}
          />
          </Fade>
          </View>
          <View style={{height:310}}>
          <Fade mindellay={-200}>
          <FilterGroup
            onSelect={(obj) => {
              if (Platform.OS === "ios") Haptics.selectionAsync();
              if (providers.includes(obj.id)) {
                const index = providers.indexOf(obj.id);
                if (index > -1) {
                  providers.splice(index, 1);
                }
              } else {
                providers.push(obj.id);
              }
            }}
            groupName={i18n.t("Providers")}
            groupData={filters.companies}
          />
          </Fade>
          </View>
          <View style={{height:610}}>
          <Fade mindellay={-100}>
          {type === "movie" && (
            <PillFilterGroup
              onSelect={(obj) => {
                if (Platform.OS === "ios") Haptics.selectionAsync();
                if (genres.includes(obj.id)) {
                  const index = genres.indexOf(obj.id);
                  if (index > -1) {
                    genres.splice(index, 1);
                  }
                } else {
                  genres.push(obj.id);
                }
              }}
              groupName={i18n.t("Genre")}
              groupData={filters.movieGenres}
            />
          )}
          {type === "tv" && (
            <PillFilterGroup
              onSelect={(obj) => {
                if (Platform.OS === "ios") Haptics.selectionAsync();
                if (tvGenres.includes(obj.id)) {
                  const index = tvGenres.indexOf(obj.id);
                  if (index > -1) {
                    tvGenres.splice(index, 1);
                  }
                } else {
                  tvGenres.push(obj.id);
                }
              }}
              groupName={i18n.t("Genre")}
              groupData={filters.tvGenres}
            />
          )}
          {type === "movie" && (
            <PillFilterGroup
              region={region}
              onSelect={(obj) => {
                if (Platform.OS === "ios") Haptics.selectionAsync();
                if (ratings.includes(obj.certification)) {
                  const index = ratings.indexOf(obj.certification);
                  if (index > -1) {
                    ratings.splice(index, 1);
                  }
                } else {
                  ratings.push(obj.certification);
                }
              }}
              groupName={i18n.t("Rating")}
              groupData={filters.ratings.movie_certifications[ratitingsSystem]}
            />
          )}
          {type === "tv" && (
            <PillFilterGroup
              region={region}
              onSelect={(obj) => {
                if (Platform.OS === "ios") Haptics.selectionAsync();
                if (tvRatings.includes(obj.certification)) {
                  const index = tvRatings.indexOf(obj.certification);
                  if (index > -1) {
                    tvRatings.splice(index, 1);
                  }
                } else {
                  tvRatings.push(obj.certification);
                }
              }}
              groupName={i18n.t("Rating")}
              groupData={filters.ratings.tv_certifications[ratitingsSystem]}
            />
          )}
          </Fade>
          </View>
        </ScrollView>
        {!loading && (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <AppButton
              style={{
                positon: "absolute",
                bottom: 5,
              }}
              color={"secondary"}
              title={i18n.t("CreateGroup")}
              onPress={createGroup}
            />
          </KeyboardAvoidingView>
        )}
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
              source={require("../../assets/animations/loader.json")}
            />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  TitleDiv: {
    //borderBottomWidth: 1.2,
    width: "70%",
    alignSelf: "baseline",
    marginBottom: 6,
  },
  input: {
    margin: 15,
    height: 40,
    padding: 10,
    fontSize: 16,
    fontWeight: "500",
    borderColor:colors.red,
    color: colors.primaryText,
    backgroundColor:colors.fg06,
    borderRadius:30,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 1,
    shadowOpacity: 0.1,
    
  },
  Title: {
    fontSize: 40,
    color: colors.black,
    textAlign: "left",
  },
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

export default CreateGroupScreen;
