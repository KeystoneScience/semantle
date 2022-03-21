import React from "react";
import {
  ScrollView,
  FlatList,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Modalize } from "react-native-modalize";
import AppText from "../../components/AppText";
import Fade from "../../components/Fade";
import MoreMovieInfo from "../stats/MoreMovieInfo";
import colors from "../../config/colors";
import * as Haptics from "expo-haptics";

import i18n from "i18n-js";
import { cool } from "react-native-color-matrix-image-filters";

export default function ({ shows = [], type, setModalVisible }) {
  return (
    <View>
      <FlatList
        data={shows}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            delayPressIn={0}
            onPress={() => {
              if (Platform.OS === "ios") Haptics.selectionAsync();
              if (!item.id) {
                return;
              }
              setModalVisible({ visible: true, groupMovie: item, type: type });
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
                  {item.poster_path && (
                    <Image
                      source={{
                        uri:
                          "https://image.tmdb.org/t/p/w342" + item.poster_path,
                      }}
                      style={{
                        width: "100%",
                        height: 175,
                        resizeMode: "contain",
                      }}
                    />
                  )}
                  {!item.poster_path && (
                    <View
                      style={{
                        width: "100%",
                        height: 175,
                        resizeMode: "contain",
                        backgroundColor: colors.primary,
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: 5,
                      }}
                    >
                      <AppText style={{ fontWeight: "600", fontSize: 20 }}>
                        {item.name || item.title}
                      </AppText>
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
    </View>
  );
}
