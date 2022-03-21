import React, { useRef } from "react";
import { View, Image, Platform } from "react-native";
import colors from "../../config/colors";
import AppText from "../../components/AppText";
import UserAvatar from "react-native-user-avatar";
import { RectButton, Swipeable } from "react-native-gesture-handler";
var colorArray = [
  colors.primary,
  colors.secondary,
  "#2FE079",
  "#73B758",
  "#7C57E0",
  "#5A89F8",
  "#D88645",
  "#F5D647",
];

function getDateString(date) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const day = date.getDate();
  const dayPostFix =
    day % 10 == 1 ? "st" : day % 10 == 2 ? "nd" : day % 10 == 3 ? "rd" : "th";
  return (
    months[date.getMonth()] + " " + day + dayPostFix + ", " + date.getFullYear()
  );
}

export default function Message({ picture, username, message, timestamp }) {
  const milliseconds = timestamp * 1000;
  const dateObject = new Date(milliseconds);
  const humanDateFormat = getDateString(dateObject);
  const n = dateObject.toLocaleString().search(",");
  const ptwohumanDateFormat = dateObject.toLocaleTimeString();
  const RightActions = () => {
    return (
      <View
        style={{
          width: "258%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "right",
          marginRight: 10,
        }}
      >
        <AppText
          style={{ textAlign: "right", width: "100%", color: colors.AAText }}
        >
          {humanDateFormat}
        </AppText>
        <AppText
          style={{ textAlign: "right", width: "100%", color: colors.AAText }}
        >
          {ptwohumanDateFormat}
        </AppText>
      </View>
    );
  };
  return (
    <Swipeable
      friction={0.9}
      // renderLeftActions={LeftActions}
      renderRightActions={RightActions}
      onSwipeFromLeft={() => alert("SWIPED LEFT")}
      onRightPress={() => alert("Press Right")}
    >
      <View
        style={{
          backgroundColor: colors.background,
          display: "flex",
          flexDirection: "row",
          borderBottomColor: colors.gray,
          borderBottomWidth: 0,
          width: "100%",
        }}
      >
        <View style={{ margin: 8 }}>
          <UserAvatar
            size={40}
            name={username}
            bgColor={colorArray[username.length % 8]}
          />
        </View>

        <View
          style={{
            display: "flex",
            flex: 6,
            flexDirection: "column",
            margin: 5,
          }}
        >
          <AppText style={{ fontSize: 17, fontWeight: "600" }}>
            {username}
          </AppText>
          <AppText style={{ fontSize: 15 }}>{message}</AppText>
        </View>
      </View>
    </Swipeable>
  );
}
