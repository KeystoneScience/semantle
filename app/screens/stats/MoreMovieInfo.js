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

import { WebView } from "react-native-webview";

import AppButton from "../../components/AppButton";

import colors from "../../config/colors";
import AppText from "../../components/AppText";
import filters from "../../config/filters";
import useApi from "../../hooks/useApi";
import movies from "../../api/movies";
import info from "../../api/info";
import { FontAwesome5 } from "@expo/vector-icons";

// import info from "../../api/";
import i18n from "i18n-js";
import translate from "../../config/translate";
import { Platform } from "react-native";
function MoreMovieInfo({
  onClose,
  overview,
  backdrop_path,
  release_date,
  title,
  name,
  vote_average,
  genre_ids,
  providers,
  type,
  id,
  onSimilarMovie,
}) {
  const [descriptionFont, setDescriptionFont] = React.useState(14);
  const [descriptionNumberLines, setDescriptionNumberLines] = React.useState(9);
  const [trailer, setTrailer] = React.useState("");

  const [genres, setGenres] = React.useState([]);
  const [watchProviders, setWatchProviders] = React.useState([]);
  const [similarMovies, setSimilarMovies] = React.useState([]);
  const [tmdbLink, setTmdbLink] = React.useState("");

  const videoRef = useRef();

  const movieProvidersApi = useApi(movies.getProviders);
  const movieInfoApi = useApi(info.getInfo);

  const getProvider = async (providerArray) => {
    const listOfProviders = [];
    for (let m = 0; m < providerArray.length; ++m) {
      for (let i = 0; i < filters.companies.length; ++i) {
        if (providerArray[m] == filters.companies[i].id) {
          listOfProviders.push(filters.companies[i]);
          break;
        }
      }
    }
    setWatchProviders(listOfProviders);
  };

  const getProvidersCall = async () => {
    const response = await movieProvidersApi.request(id, type);
    const providerArray = [];
    if (response.data && response.data.link) {
      setTmdbLink(response.data.link);
    }
    if (response.data && response.data.flatrate) {
      for (let i = 0; i < response.data.flatrate.length; ++i) {
        providerArray.push(response.data.flatrate[i].provider_id);
      }
      if (providerArray.length > 0) {
        getProvider(providerArray);
      }
    } else {
      return;
    }
    // {
    //   "flatrate": Array [
    //     Object {
    //       "display_priority": 0,
    //       "logo_path": "/9A1JSVmSxsyaBK4SUFsYVqbAYfW.jpg",
    //       "provider_id": 8,
    //       "provider_name": "Netflix",
    //     },
    //   ],
    //   "link": "https://www.themoviedb.org/movie/793723-sentinelle/watch?locale=US",
    // }
  };

  React.useEffect(() => {
    if (providers) {
      if (providers.split("|").length == 1) {
        getProvider([providers]);
      }
    }
    getProvidersCall();

    //Code for fetching movie information
    movieInfoApi.request(type, id).then(({ data }) => {
      if (data && data.videos) {
        data.videos.results.forEach((clip) => {
          if (clip.type === "Trailer") {
            setTrailer(clip.key);
            return;
          }
        });
      }
      if (data && data.similar && data.similar.results) {
        setSimilarMovies(data.similar.results);
      }
    });

    const genresArray = [];
    for (let i = 0; i < genre_ids.length; ++i) {
      var found = false;
      for (let j = 0; j < filters.movieGenres.length; j++) {
        if (filters.movieGenres[j].id == genre_ids[i]) {
          genresArray.push(filters.movieGenres[j].name);
          found = true;
          break;
        }
      }
      if (!found) {
        for (let j = 0; j < filters.tvGenres.length; j++) {
          if (filters.tvGenres[j].id == genre_ids[i]) {
            genresArray.push(filters.tvGenres[j].name);
            found = true;
            break;
          }
        }
      }
    }
    setGenres(genresArray);
  }, [id]);

  return (
    <ScrollView alwaysBounceVertical={false}>
      <View
        style={{
          position: "relative",
          width: "100%",
          height: 200,
          backgroundColor: colors.backgroundDarken,
        }}
      >
        <Fade style={{ position: "absolute", width: "100%" }} minduration={200}>
          <View style={{ position: "absolute", width: "100%" }}>
            <Image
              source={{
                uri: "https://image.tmdb.org/t/p/w780" + backdrop_path,
              }}
              style={{ height: 200, width: "100%", position: "absolute" }}
            ></Image>
          </View>
        </Fade>
        {trailer != "" && (
          <Fade>
            <WebView
              ref={videoRef}
              javaScriptEnabled={true}
              scrollEnabled={false}
              allowsFullscreenVideo={true}
              userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 
 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
              source={{
                uri: `https://www.youtube.com/embed/${trailer}?&mute=1&showinfo=0&controls=1&fullscreen=1`,
              }}
              style={{
                height: 200,
                width: "100%",
                position: "absolute",
                zIndex: 5,
                opacity: 0.99,
              }}
            />
          </Fade>
        )}
      </View>
      <Fade mindellay="-200">
        <AppText
          style={{
            fontSize: 24,
            textAlign: "left",
            color: colors.AAText,
            paddingTop: 10,
            paddingLeft: 10,
            fontWeight: "500",
            paddingRight: 10,
          }}
        >
          {title || name}
        </AppText>

        <AppText
          style={{
            fontSize: 12,
            color: colors.AAAText,
            paddingLeft: 10,
            paddingBottom: 3,
          }}
        >
          {release_date ? release_date.substring(0, 4) : ""}
        </AppText>
        <AppText
          style={{
            fontSize: 10,
            paddingLeft: 10,
            paddingBottom: 10,
            color: colors.AAAText,
          }}
        >
          {i18n.t("AudienceScore")}: {vote_average}
        </AppText>
      </Fade>
      <Fade mindellay={-250}>
        <View style={{ paddingTop: 0, paddingLeft: 10, paddingRight: 10 }}>
          <Text
            //numberOfLines={descriptionNumberLines}
            // adjustsFontSizeToFit
            style={[
              styles.text,
              styles.price,
              { fontSize: descriptionFont, color: colors.AAText },
            ]}
            onTextLayout={(e) => {
              const { lines } = e.nativeEvent;
              if (lines.length > descriptionNumberLines) {
                setDescriptionFont(descriptionFont - 1);
                setDescriptionNumberLines(descriptionNumberLines + 1);
              }
            }}
          >
            {overview}
          </Text>
        </View>
      </Fade>
      <Fade mindellay={-300}>
        <ScrollView horizontal={true}>
          {genres.map((item, index) => (
            <View
              key={"GENRES" + index}
              style={{
                flexDirection: "column",
                margin: 5,
                display: "flex",
                padding: 2,
                overflow: "visible",
              }}
            >
              {item && (
                <View
                  style={{
                    backgroundColor: colors.fg08,
                    borderRadius: 50,
                    padding: 7,
                    flex: 1,
                    alignContent: "center",
                    justifyContent: "center",
                    overflow: "visible",
                  }}
                >
                  <AppText
                    style={{
                      textAlign: "center",
                      fontWeight: "500",
                      fontSize: 10,
                      margin: 2,
                      color: colors.AAAText,
                    }}
                  >
                    {item}
                  </AppText>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </Fade>
      <Fade mindellay={-350}>
        {watchProviders.length > 0 && (
          <AppText style={{ paddingLeft: 10 }}>{i18n.t("Providers")}:</AppText>
        )}
        <ScrollView horizontal={true}>
          {watchProviders.map((item, index) => (
            <View
              key={index + "PROVIDERS"}
              delayPressIn={0}
              style={{
                height: 80,
                width: 120,
                margin: 10,
              }}
            >
              {item.id && (
                <Image style={styles.imageThumbnail} source={item.src} />
              )}
            </View>
          ))}
        </ScrollView>
        {similarMovies.length > 0 && (
          <View>
            <AppText style={{ paddingLeft: 10 }}>Similar Media:</AppText>
            <ScrollView horizontal={true}>
              {similarMovies.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  delayPressIn={0}
                  onPress={() => {
                    if (Platform.OS === "ios") Haptics.selectionAsync();
                    if (!item.id) {
                      return;
                    }
                    onSimilarMovie(item);
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

        {tmdbLink.length > 0 && (
          <AppButton
            onPress={() => {
              Linking.openURL(tmdbLink);
            }}
            title={i18n.t("MoreInfo")}
          ></AppButton>
        )}
        <View style={{ paddingTop: 10 }}>
          <AppText
            style={{
              paddingLeft: 20,
              color: colors.primaryText,
              fontSize: 13,
              textAlign: "left",
            }}
          >
            {i18n.t("Powered By")}
          </AppText>
          <Image
            style={{ resizeMode: "contain", height: 50, width: 150 }}
            source={require("../../assets/logos/tmdb_logo.png")}
          ></Image>
          <AppText
            style={{
              paddingLeft: 20,
              paddingTop: 5,
              color: colors.primaryText,
              fontSize: 8,
              textAlign: "left",
            }}
          >
            {i18n.t("This product uses the TMDb API")}
          </AppText>
        </View>
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
