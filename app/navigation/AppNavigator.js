import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import { Animated } from "react-native";
import SwipeScreen from "../screens/SwipeScreen";
import LandingScreen from "../screens/landing/LandingScreen";
import JoinScreen from "../screens/join/JoinGroupScreen";
import CreateGroupScreen from "../screens/create/CreateGroupScreen";
import ShareScreen from "../screens/ShareScreen";
import GroupStats from "../screens/stats/GroupStats";
import Tutorial from "../screens/Tutorial";
import PersonalLikesScreeen from "../screens/PersonalLikesScreen";
import Drawer from "../screens/landing/Drawer";
import Room from "../screens/message/Room";
import SearchScreen from "../screens/search/SearchScreen";

const Stack = createStackNavigator();
const config = {
  animation: "spring",
  config: {
    stiffness: 500,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const forSlide = ({ current, next, inverted, layouts: { screen } }) => {
  const progress = Animated.add(
    current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
    next
      ? next.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
          extrapolate: "clamp",
        })
      : 0
  );

  return {
    cardStyle: {
      opacity: progress.interpolate({
        // inputRange: [0, 0.5, 0.9, 1],
        // outputRange: [0, 0.25, 0.7, 1],
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.8, // Fully unfocused
              ],
              extrapolate: "clamp",
            }),
            inverted
          ),
        },
      ],
    },
  };
};

const AppNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Landing"
      component={LandingScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Likes"
      component={PersonalLikesScreeen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Drawer"
      component={Drawer}
      headerTransparent={true}
      options={{
        headerShown: false,
        cardStyle: { backgroundColor: "transparent" },
        cardOverlayEnabled: true,
        cardStyleInterpolator: ({ current: { progress, next } }) => ({
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0],
              extrapolate: "clamp",
            }),
          },
          transitionSpec: {
            open: config,
            close: config,
          },
        }),
        cardStyleInterpolator: forSlide,
        gestureDirection: "horizontal-inverted",
        gestureResponseDistance: {
          horizontal: 300,
        },
      }}
    />
    <Stack.Screen
      name="Swipe"
      component={SwipeScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Chat"
      component={Room}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Create"
      component={CreateGroupScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Stats"
      component={GroupStats}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Tutorial"
      component={Tutorial}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AppNavigator;
