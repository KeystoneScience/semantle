import React, { useRef } from "react";

import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";

import * as Haptics from "expo-haptics";

import Fade from "../../components/Fade";
import useApi from "../../hooks/useApi";
import info from "../../api/info";

import colors from "../../config/colors";
import AppText from "../../components/AppText";
import { Platform } from "react-native";
import TextLoader from "../../components/skeleton_loaders/TextLoader";
const posterSizeHeight = 240;
function MoreMovieInfo({
  onClose,
  id,
  onSimilarMovie,
  known_for_department,
  known_for,
  name,
  popularity,
  profile_path,
}) {
  const infoFetch = useApi(info.getInfo);
  const [biography, setBiography] = React.useState("");
  const [movies, setMovies] = React.useState([]);
  const [tv, setTV] = React.useState([]);

  React.useEffect(() => {
    infoFetch.request("person", id).then(({ data }) => {
      setBiography(data.biography);
      setMovies(data.movie_credits.cast);
      setTV(data.tv_credits.cast);
    });
  }, []);

  return (
    <ScrollView alwaysBounceVertical={false}>
      <Fade mindellay="-200">
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {profile_path && (
            <Image
              source={{
                uri: "https://image.tmdb.org/t/p/w342" + profile_path,
              }}
              style={{
                width: posterSizeHeight * 0.69,
                height: posterSizeHeight,
                resizeMode: "contain",
              }}
            />
          )}
          {!profile_path && (
            <View
              style={{
                width: posterSizeHeight * 0.69,
                height: posterSizeHeight,
                resizeMode: "contain",
                backgroundColor: colors.primary,
                display: "flex",
                justifyContent: "flex-end",
                padding: 5,
              }}
            >
              <AppText style={{ fontWeight: "600", fontSize: 18 }}>
                {name}
              </AppText>
            </View>
          )}
          <View style={{ padding: 10 }}>
            <AppText style={{ fontWeight: "600", fontSize: 20 }}>
              {name}
            </AppText>
          </View>
        </View>
      </Fade>
      <Fade mindellay={-350}>
        {movies.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <AppText style={{ marginLeft: 10, fontSize: 16 }}>Movies</AppText>
            <ScrollView horizontal={true}>
              {movies.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  delayPressIn={0}
                  onPress={() => {
                    if (Platform.OS === "ios") Haptics.selectionAsync();
                    if (!item.id) {
                      return;
                    }
                    onSimilarMovie({ ...item, media_type: "movie" });
                    // setModalVisible({ visible: true, groupMovie: item });
                    // modalizeRef.current.open();
                  }}
                  style={{
                    flex: 0.33,
                    flexDirection: "column",
                    margin: 5,
                    height: 138,
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    backgroundColor: "#0000",
                    elevation: 4,
                    shadowOpacity: item.isNotPressed ? 0 : 0.5,
                  }}
                >
                  <Fade>
                    {item.poster_path && (
                      <Image
                        source={{
                          uri:
                            "https://image.tmdb.org/t/p/w185" +
                            item.poster_path,
                        }}
                        style={{
                          width: 92,
                          height: 138,
                          resizeMode: "contain",
                        }}
                      />
                    )}
                    {!item.poster_path && (
                      <View
                        style={{
                          width: 92,
                          height: 138,
                          resizeMode: "contain",
                          backgroundColor: colors.primary,
                          display: "flex",
                          justifyContent: "flex-end",
                          padding: 5,
                        }}
                      >
                        <AppText style={{ fontWeight: "600", fontSize: 15 }}>
                          {item.name || item.title}
                        </AppText>
                      </View>
                    )}
                  </Fade>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {tv.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <AppText style={{ marginLeft: 10, fontSize: 16 }}>Shows</AppText>
            <ScrollView horizontal={true}>
              {tv.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  delayPressIn={0}
                  onPress={() => {
                    if (Platform.OS === "ios") Haptics.selectionAsync();
                    if (!item.id) {
                      return;
                    }
                    onSimilarMovie({ ...item, media_type: "tv" });
                    // setModalVisible({ visible: true, groupMovie: item });
                    // modalizeRef.current.open();
                  }}
                  style={{
                    flex: 0.33,
                    flexDirection: "column",
                    margin: 5,
                    height: 138,
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    backgroundColor: "#0000",
                    elevation: 4,
                    shadowOpacity: item.isNotPressed ? 0 : 0.5,
                  }}
                >
                  <Fade>
                    {item.poster_path && (
                      <Image
                        source={{
                          uri:
                            "https://image.tmdb.org/t/p/w185" +
                            item.poster_path,
                        }}
                        style={{
                          width: 92,
                          height: 138,
                          resizeMode: "contain",
                        }}
                      />
                    )}
                    {!item.poster_path && (
                      <View
                        style={{
                          width: 92,
                          height: 138,
                          resizeMode: "contain",
                          backgroundColor: colors.primary,
                          display: "flex",
                          justifyContent: "flex-end",
                          padding: 5,
                        }}
                      >
                        <AppText style={{ fontWeight: "600", fontSize: 15 }}>
                          {item.name || item.title}
                        </AppText>
                      </View>
                    )}
                  </Fade>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {infoFetch.loading && <TextLoader />}
        {biography !== "" && (
          <AppText style={{ fontSize: 16, padding: 10 }}>{biography}</AppText>
        )}
        <View style={{ height: 50 }} />
      </Fade>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  FullView: {
    backgroundColor: colors.backgroundDarken,
    flex: 1,
    position: "absolute",
    width: "100%",
    justifyContent: "center",
    overflow: "hidden",
  },
  imageThumbnail: {
    justifyContent: "center",
    //resizeMode: "contain",
    alignItems: "center",
    width: "100%",
    height: 80, //67,
  },
  CardArea: {
    height: "70%",
    width: "90%",
    backgroundColor: colors.fg06,
    alignSelf: "center",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 4,
  },
  image: {
    marginTop: 10,
    height: 100,
    width: 100,
    resizeMode: "contain",
    borderRadius: 3,
    alignSelf: "center",
    overflow: "hidden",
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

export default MoreMovieInfo;
