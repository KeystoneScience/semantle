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
        ...groupData[i],
        isNotPressed: true,
      };
    });
    items.sort(function (x, y) {
      return x.order - y.order;
    });
    setDataSource(items);
  }, [groupData]);
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
              if (item.isNotPressed) {
                item.isNotPressed = false;
              } else {
                item.isNotPressed = true;
              }
              setStateChanged(stateChanged + 1);
              onSelect(item);
            }}
            style={{
              flex: 0.33,
              flexDirection: "column",
              margin: 5,
            }}
          >
            {(item.name || item.certification) && !item.isNotPressed && (
              <View
                style={{
                  backgroundColor: colors.primaryTransparent,
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  elevation: 4,
                  shadowOpacity: 0.2,
                  height: 50,
                  borderRadius: 50,
                  flex: 1,
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <AppText
                  style={{
                    textAlign: "center",
                    fontWeight: "500",
                    color: colors.white,
                  }}
                >
                  {item.name || item.certification}
                </AppText>
              </View>
            )}
            {(item.name || item.certification) && item.isNotPressed && (
              <View
                style={{
                  backgroundColor: colors.fg06,
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  elevation: 4,
                  shadowOpacity: 0.2,
                  height: 50,
                  borderRadius: 50,
                  flex: 1,
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ textAlign: "center", fontWeight: "500" }}>
                  {item.name || item.certification}
                </AppText>
              </View>
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
