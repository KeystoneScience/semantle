import { Appearance, useColorScheme } from "react-native-appearance";

export default false
  ? {
      transparent: "rgba(0, 0, 0, 0)",
      gray: "#777777",
      background: "#ECF5F7", //#fff7f0 <--old one now its blueish 2% darker
      primary: "#E50914",
      primaryTransparent: "rgba(81, 194, 213, .975)", //187, 241, 250
      secondary: "#ec4646",
      white: "#fff",
      blue: "0000D5",
      black: "#000",
      grey: "#DEDEDE",
      backgroundDarken: "rgba(0,0,0,.25)",
      backgroundDarkenLess: "rgba(0,0,0,.15)",
      selectGreen: "rgba(8, 168, 0, .6)",
      //--------------------------------------
      backbround_icon: "rgba(0,0,0, .87)",
      //-
      AATextDARK: "rgba(255,255,255, .87)",
      primaryText: "rgba(0, 0, 0, 1)", //A Text size
      AAText: "rgba(0, 0, 0, .87)", //AA Text size
      AAAText: "rgba(0, 0, 0, .60)", //AAA Text size
      //-----------------------------------------
      red: "#f93b1e",
      yellow: "#f7bf00",
      greenHeart: "#29bb2c",
      //---------------------------------------
      fg00: "rgba(255, 255, 255, 0)",
      fg01: "rgba(255, 255, 255, .05)",
      fg02: " rgba(255, 255, 255, .07)",
      fg03: "rgba(255, 255, 255, .08)",
      fg04: "rgba(0, 0, 0, .09)",
      fg06: "rgba(251, 253, 254, 1)", //2c2c2c
      fg08: "#F3F5F6",
      fg12: "rgba(255, 255, 255, .14)",
      fg16: "rgba(251, 253, 254, .98)",
      fg24: "rgba(255, 255, 255, .16)",
      theme: "light",
    }
  : {
      //dark theme----------------------------------------------------------------------------
      background: "#000000", //11181e //121212
      lightGray: "#404040",
      topHeaderColor: "rgba(0, 0, 0, .95)",
      primary: "#00C5C5",
      primaryTransparent: "rgba(81, 193, 213, .975)",
      secondary: "#C50000",
      white: "#fff",
      black: "#000",
      lightlightGray: "#E0E0E0",
      grey: "#DEDEDE",
      selectGreen: "rgba(8, 168, 0, .6)",
      backgroundDarken: "rgba(0,0,0,.25)",
      backgroundDarkenLess: "rgba(0,0,0,.15)",
      gray: "#777777",
      blue: "0000D5",

      //--------------------------------------
      backbround_icon: "rgba(255,255,255, .87)",
      //--
      AATextDARK: "rgba(255,255,255, .87)",
      primaryText: "rgba(255,255,255, 1)", //A Text size
      AAText: "rgba(255,255,255, .87)", //AA Text size
      AAAText: "rgba(255,255,255, .6)", //AAA Text size
      //----------------------------------------------
      red: "#d9231a",
      yellow: "#f7bf00",
      greenHeart: "#5ca23e",
      //-------------------------------------------
      fg00: "rgba(255, 255, 255, 0)",
      fg01: "rgba(255, 255, 255, .05)",
      fg02: " rgba(255, 255, 255, .07)",
      fg03: "rgba(255, 255, 255, .08)",
      fg04: "rgba(255, 255, 255, .09)",
      fg06: "#151515", //2c2c2c
      fg08: "#404040",
      fg12: "rgba(255, 255, 255, .14)",
      fg16: "rgba(54, 59, 59, .97)", //31383e //353535 <--solid color
      fg24: "rgba(255, 255, 255, .16)",
      theme: "dark",
    };

// blue: "#0070FF",
// superBlue: "#4faaff",
// green: "#43d96b",
