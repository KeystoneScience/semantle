import {
  View,
  Text,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  Platform,
  SafeAreaView,
} from "react-native";
import React from "react";

import {
  Foundation,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Entypo,
  Ionicons,
} from "@expo/vector-icons";

import Constants from "expo-constants";
import Accordian from "./Accordion";
import colors from "../configs/colors";

function Drawer({ navigation, route }) {
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View style={styles.leftWhole}>
        <View
          style={{ width: "100%", display: "flex", alignItems: "flex-end" }}
        ></View>
        <ScrollView>
          <View style={{ height: 64 }} />
        </ScrollView>
        <SafeAreaView style={styles.bottomwhole}>
          <Accordian
            // expanded={true}
            title={"Support Semantle"}
            data={"sdfsfdsdasdfsd"}
            titleIcon={
              <AntDesign
                name="heart"
                size={22}
                color={colors.darkenColor(colors.colors.backgroundColor, 80)}
                style={{ marginRight: -36 }}
              />
            }
            children={
              <View>
                <View
                  style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                  }}
                >
                  {/* <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    "https://www.facebook.com/FlixPix-113664830823363"
                  )
                }
              >
                <View
                  style={{
                    backgroundColor: "#1778f2",
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome
                    name="facebook-f"
                    size={25}
                    color={'black'}
                    style={{ alignSelf: "center" }}
                  />
                </View>
              </TouchableOpacity> */}

                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        "https://www.linkedin.com/company/red-avocado-llc"
                      )
                    }
                  >
                    <View
                      style={{
                        backgroundColor: "#2867B2",
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        justifyContent: "center",
                      }}
                    >
                      <FontAwesome5
                        name="linkedin-in"
                        size={25}
                        color={"black"}
                        style={{ alignSelf: "center" }}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL("https://instagram.com/flixpix.app")
                    }
                  >
                    <View
                      style={{
                        backgroundColor: "#cc2366",
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        justifyContent: "center",
                      }}
                    >
                      <AntDesign
                        name="instagram"
                        size={25}
                        color={"black"}
                        style={{ alignSelf: "center" }}
                      />
                    </View>
                  </TouchableOpacity>
                  {/* <TouchableOpacity onPress={ ()=> Linking.openURL('https://discord.gg/PACd5jXfKp') }>
                <View
                  style={{
                    backgroundColor: "#7289DA",
                    width: 50,
                    height: 50,
                    borderRadius: 50,
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome5
                    name="discord"
                    size={25}
                    color={'black'}
                    style={{ alignSelf: "center" }}
                  />
                </View>
              </TouchableOpacity> */}
                </View>

                <TouchableOpacity
                  onPress={() =>
                    Platform.OS === "ios"
                      ? Linking.openURL(
                          "https://itunes.apple.com/us/app/flixpix/id1561264727"
                        )
                      : Linking.openURL(
                          "https://play.google.com/store/apps/details?id=com.nateastone.FlixPix"
                        )
                  }
                >
                  <View
                    style={[
                      styles.tutorialwhole,
                      { backgroundColor: "yellow", marginTop: 15 },
                    ]}
                  >
                    <FontAwesome
                      name="star"
                      size={30}
                      color={colors.darkenColor(
                        colors.colors.backgroundColor,
                        80
                      )}
                      style={{ marginLeft: 10 }}
                    />
                    <Text style={styles.tutorialText}>Rate Semantle</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://flixpix.app/requestfeature")
                  }
                >
                  <View
                    style={[
                      styles.tutorialwhole,
                      { backgroundColor: "rgba(255,255,255,.3)", marginTop: 0 },
                    ]}
                  >
                    <FontAwesome5
                      name="lightbulb"
                      size={30}
                      color={colors.darkenColor(
                        colors.colors.backgroundColor,
                        80
                      )}
                      style={{ marginLeft: 10 }}
                    />
                    <Text style={styles.tutorialText}>Request Feature</Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
          />
          <Accordian
            title={"Help"}
            data={"sdfsfdsdasdfsd"}
            titleIcon={
              <Entypo
                name="help"
                size={22}
                color={"black"}
                style={{ marginRight: "-50%" }}
              />
            }
            children={
              <View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Tutorial")}
                >
                  <View style={styles.tutorialwhole}>
                    <Foundation
                      name="guide-dog"
                      size={44}
                      color={colors.darkenColor(
                        colors.colors.backgroundColor,
                        80
                      )}
                      style={{ marginLeft: 10 }}
                    />
                    <Text style={styles.tutorialText}>Tutorial</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://flixpix.app/bug-report")
                  }
                >
                  <View
                    style={[
                      styles.tutorialwhole,
                      { backgroundColor: colors.colors.fadeListColor },
                    ]}
                  >
                    <Entypo
                      name="bug"
                      size={26}
                      color={"rgba(255,255,255,.8)"}
                      style={{ marginLeft: 10 }}
                    />
                    <Text style={styles.tutorialText}>Report Problem</Text>
                  </View>
                </TouchableOpacity>
              </View>
            }
          />
        </SafeAreaView>
      </View>
      <TouchableWithoutFeedback onPress={() => navigation.navigate("Home")}>
        <View style={styles.rightWhole}></View>
      </TouchableWithoutFeedback>
    </View>
  );
}
const styles = StyleSheet.create({
  bottomwhole: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  leftWhole: {
    width: "80%",
    height: "100%",
    backgroundColor: colors.lightenColor(colors.colors.backgroundColor, 40),
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  rightWhole: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, .2)",
  },
  tutorialwhole: {
    backgroundColor: "rgba(255,255,255,.3)",
    height: 70,
    width: "80%",
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tutorialText: {
    paddingHorizontal: 15,
    fontSize: 20,
    paddingTop: 7,
    color: colors.darkenColor(colors.colors.backgroundColor, 30),
  },
});
export default Drawer;
