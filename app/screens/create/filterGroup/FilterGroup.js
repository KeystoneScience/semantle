import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import colors from "../../../config/colors";
import AppText from "../../../components/AppText";

//const startingIndex = Math.floor(Math.random() * 10);
// import AvatarIcon from "./avatar";
function FilterGroup({ groupName, groupData, onSelect }) {
  const [dataSource, setDataSource] = useState([]);
  const [stateChanged, setStateChanged] = useState(1);
  useEffect(() => {
    let items = Array.apply(
      null,
      Array(
        groupData
          ? groupData.length
            ? groupData.length % 3 == 0
              ? groupData.length
              : groupData.length + 3 - (groupData.length % 3)
            : 0
          : 0
      )
    ).map((v, i) => {
      return {
        //id: i,
        //
        ...groupData[i],
      };
    });
    setDataSource(items);
  }, []);
  return (
    <View style={styles.container}>
      <AppText style={{ fontSize: 20, fontWeight: "bold" }}>
        {groupName}
      </AppText>
      <FlatList
        data={dataSource}
        renderItem={({ item }) => (
          <TouchableOpacity
            delayPressIn={0}
            onPress={() => {
              if (item.id === "movie" || item.id === "tv") {
                var items = dataSource;
                switch (item.id) {
                  case "movie":
                    items[1].isNotPressed = true;
                    items[0].isNotPressed = false;
                    onSelect(item);
                    break;
                  case "tv":
                    items[0].isNotPressed = true;
                    items[1].isNotPressed = false;
                    onSelect(item);
                    break;
                }
                setStateChanged(items);
                setStateChanged(stateChanged + 1);
                return;
              }
              if (item.isNotPressed) {
                item.isNotPressed = false;
              } else {
                item.isNotPressed = true;
              }
              setStateChanged(stateChanged + 1);
              onSelect(item);
            }}
            style={{
              flex: item.id === "movie" || item.id === "tv" ? 1000 : 0.33,
              flexDirection: "column",
              margin: 5,

              // borderBottomWidth: item.src ? 1.2 : 0,
              // borderTopWidth: item.src ? 1.2 : 0,
              // borderRightWidth: item.src ? 1.2 : 0,
              // borderLeftWidth: item.src ? 1.2 : 0,
              shadowOffset: {
                width: 0,
                height: 2,
              },
              backgroundColor: "#0000",
              elevation: 4,
              shadowOpacity: item.isNotPressed ? 0 : 0.5,
            }}
          >
            {/* {item.isNotPressed && (
              <Image style={styles.imageThumbnailGray} source={item.src} />
            )}
            {item.isNotPressed && (
              <Image
                style={styles.imageThumbnailSeeThrough}
                source={item.src}
              />
            )} */}
            {item.isNotPressed && (
              <Image style={styles.imageThumbnail} source={item.src} />
            )}
            {item.id && !item.isNotPressed && (
              <Image
                style={[
                  styles.imageThumbnail,
                  { borderColor: colors.primaryTransparent, borderWidth: 5 },
                ]}
                source={item.src}
              />
            )}
          </TouchableOpacity>
        )}
        //Setting the number of column
        numColumns={3}
        keyExtractor={(item, index) => index}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  imageThumbnailSeeThrough: {
    justifyContent: "center",
    //resizeMode: "contain",
    position: "absolute",
    opacity: 0.3,
    alignItems: "center",
    width: "100%",
    height: 80, //67,
  },
  imageThumbnail: {
    justifyContent: "center",
    //resizeMode: "contain",
    alignItems: "center",
    width: "100%",
    height: 80, //67,
  },
  imageThumbnailGray: {
    tintColor: "gray",
    justifyContent: "center",
    //resizeMode: "contain",
    tintColor: "gray",
    alignItems: "center",
    width: "100%",
    height: 80, //67,
  },
});
export default FilterGroup;
