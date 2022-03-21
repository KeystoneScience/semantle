import React, { useRef } from "react";
import {
  View,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import Header from "../../components/Header";
import { Modalize } from "react-native-modalize";
import colors from "../../config/colors";
import { AntDesign } from "@expo/vector-icons";
import SearchSelection from "./SearchSelection";
import useApi from "../../hooks/useApi";
import search from "../../api/search";
import Poster from "./Poster";
import MoreMovieInfo from "../stats/MoreMovieInfo";
import PersonResult from "./PersonResult";
import PersonInfo from "./PersonInfo";

const searchTypes = ["movie", "tv", "person"];
var lastSearch = "";

export default function ({ navigation, route }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isLoading, setLoading] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(0);

  const [modalVisible, setModalVisible] = React.useState({ visible: false });
  const modalizeRef = React.useRef();

  const [movieResults, setMovieResults] = React.useState([]);
  const [tvShowResults, setTvShowResults] = React.useState([]);
  const [personResults, setPersonResults] = React.useState([]);

  const searchFetch = useApi(search.get);

  async function performSearch(text) {
    if (!text) {
      lastSearch = "";
      setLoading(false);
      setMovieResults([]);
      setTvShowResults([]);
      setPersonResults([]);
      return;
    }
    lastSearch = text;
    const currentIndex = selectedIndex;
    const { data } = await searchFetch.request(searchTypes[currentIndex], text);
    setLoading(false);
    if (currentIndex === 0) {
      setMovieResults(data.results);
    }
    if (currentIndex === 1) {
      setTvShowResults(data.results);
    }
    if (currentIndex === 2) {
      setPersonResults(data.results);
    }
  }

  React.useEffect(() => {
    performSearch(lastSearch);
  }, [selectedIndex]);
  return (
    <View pointerEvents="box-none" style={{ width: "100%", height: "100%" }}>
      <Header
        backVisible={true}
        onBackPress={() => {
          navigation.navigate("Landing");
        }}
      />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        onScroll={() => {
          Keyboard.dismiss();
        }}
      >
        <View style={{ display: "flex", alignItems: "center" }}>
          <View
            style={{
              backgroundColor: colors.lightGray,
              height: 40,
              width: "90%",
              borderRadius: 5,
              marginTop: 5,
              padding: 5,
              justifyContent: "flex-start",
              alignItems: "center",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <AntDesign
              name="search1"
              size={18}
              color={colors.lightlightGray}
              style={{ marginRight: 5 }}
            />
            <TextInput
              style={{ flex: 1, color: colors.primaryText, fontSize: 17 }}
              onChangeText={(text) => {
                setLoading(true);
                if (timeLeft) {
                  clearTimeout(timeLeft);
                }
                setTimeLeft(
                  setTimeout(() => {
                    performSearch(text);
                  }, 500)
                );
              }}
              placeholder="Search"
              placeholderTextColor={colors.lightlightGray}
              returnKeyType="search"
              // onSubmitEditing={() => {console.log(text)}}
            />
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <SearchSelection onSelect={(index) => setSelectedIndex(index)} />

          {selectedIndex == 0 && (
            <Poster
              shows={movieResults}
              type={"movie"}
              setModalVisible={(data) => {
                setModalVisible(data);
                modalizeRef.current.open();
              }}
            />
          )}
          {selectedIndex == 1 && (
            <Poster
              shows={tvShowResults}
              type={"tv"}
              setModalVisible={(data) => {
                setModalVisible(data);
                modalizeRef.current.open();
              }}
            />
          )}
          {selectedIndex == 2 && (
            <PersonResult
              persons={personResults}
              type={"person"}
              setModalVisible={(data) => {
                setModalVisible(data);
                modalizeRef.current.open();
              }}
            />
          )}
        </View>
        <View style={{ padding: 50 }}></View>
      </ScrollView>
      <View
        pointerEvents={"none"}
        style={{
          display: "flex",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <ActivityIndicator
          size="large"
          animating={isLoading}
          color={colors.primary}
        />
      </View>
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
        {(modalVisible.type === "movie" || modalVisible.type === "tv") && (
          <MoreMovieInfo
            {...modalVisible.groupMovie}
            type={modalVisible.type}
            onSimilarMovie={(movie) => {
              setModalVisible({
                visible: true,
                groupMovie: movie,
                type: modalVisible.type,
              });
            }}
          />
        )}
        {modalVisible.type === "person" && (
          <PersonInfo
            {...modalVisible.groupMovie}
            onSimilarMovie={(movie) => {
              setModalVisible({
                visible: true,
                groupMovie: movie,
                type: movie.media_type,
              });
            }}
          />
        )}
      </Modalize>
    </View>
  );
}
