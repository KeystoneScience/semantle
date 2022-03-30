import React, { useContext } from "react";
import colors from "./colors";

import ThemeContext from "./context";

export default function useColors() {
  const { theme, setTheme } = useContext(ThemeContext);

  const colors = {
    grooveColorPallet: [
      "rgb(238,106,139)", //"rgb(247,37,133)",
      "rgb(181,23,158)",
      "rgb(114,9,183)",
      "rgb(86,11,173)",
      "rgb(72,12,168)",
      "rgb(58,12,163)",
      "rgb(63,55,210)",
      "rgb(67,97,238)",
      "rgb(72,149,239)",
      "rgb(76,201,240)",
    ],
    black: theme === "original" ? "#E8E8E8" : "#222222",
    white: "#E8E8E8",
    gray: "#f0f0f0",
    lightGray: "#fafafa",
    darkGray: "#e0e0e0",
    red: "#ff0000",
    alert: "rgba(150, 20, 10, 1)",
    green: "#00ff00",
    blue: "#0000ff",
    yellow: "#ffff00",
    orange: "#ffa500",
    purple: "#800080",
    pink: "#ffc0cb",
    brown: "#a52a2a",
    darkBlue: "#00008b",
    darkGreen: "#006400",
    darkRed: "#8b0000",
    darkYellow: "#ffd700",
    darkOrange: "#ff8c00",
    darkPurple: "#800080",
    darkPink: "#ff1493",
    darkBrown: "#a52a2a",
    lightBlue: "#add8e6",
    textInputColor: theme === "original" ? "#A0A0A0" : "rgba(0,0,0,0.4)",
    lightGreen: "#90ee90",
    backgroundColor: theme === "original" ? "#202020" : "#ACCAFD", //"rgba(150, 174, 213, 1)",
    textColor: theme === "original" ? "#E8E8E8" : darkenColor("#ACCAFD", 45),
    checkButtonColor:
      theme === "original" ? "#505050" : "rgba(137,  154,  226, 1)",
    keybordBttnColor: "rgba(137,  174,  226, 1)",
    fadeListColor: "#5ada44",
  };

  function checkTheme(themeToCheck = "original") {
    if (theme === themeToCheck) {
      return true;
    }
    return false;
  }

  function convertColorToRGBA(color, alpha = 1) {
    if (color.substring(0, 4) === "rgba") {
      return color;
    }
    //detect if color is hex or rgb
    if (color.length === 4) {
      if (color === "#fff" || color === "#FFF") {
        return "rgba(255,255,255," + alpha + ")";
      }
      return "rgba(0,0,0," + alpha + ")";
    }
    //check if color is rgb
    if (color.length > 7) {
      //split rgb string colors into array
      const colorsArray = color.substring(4, color.length - 1).split(",");
      return `rgba(${colorsArray[0]},${colorsArray[1]},${colorsArray[2]}, ${alpha})`;
    }
    //color is hex, convert color to rgb
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
  }

  // This function takes in a color and returns a lighter version of that color.
  function lightenColor(color, percent) {
    //convfrom color to rgba
    const rgba = convertColorToRGBA(color, 1);
    //split rgba into array
    const colorsArray = rgba.substring(5, rgba.length - 1).split(",");
    //get rgb values
    const r = parseInt(colorsArray[0]);
    const g = parseInt(colorsArray[1]);
    const b = parseInt(colorsArray[2]);
    //calculate lighter rgb values
    const rLight = Math.round(r + (255 - r) * (percent / 100));
    const gLight = Math.round(g + (255 - g) * (percent / 100));
    const bLight = Math.round(b + (255 - b) * (percent / 100));
    //return lighter color
    return `rgb(${rLight},${gLight},${bLight})`;
  }

  //this function takes in a color and returns a darker version of that color
  function darkenColor(color, percent) {
    //convert color to rgba
    const rgba = convertColorToRGBA(color, 1);
    //split rgba into array
    const colorsArray = rgba.substring(5, rgba.length - 1).split(",");
    //get rgb values
    const r = parseInt(colorsArray[0]);
    const g = parseInt(colorsArray[1]);
    const b = parseInt(colorsArray[2]);
    //calculate darker rgb values
    const rDark = Math.round(r * (percent / 100));
    const gDark = Math.round(g * (percent / 100));
    const bDark = Math.round(b * (percent / 100));
    //return darker color
    return `rgb(${rDark},${gDark},${bDark})`;
  }

  /*
    This function takes a color, and if it is closer to white than black, it returns black, otherwise white.
    This is used to determine the text color of a background color.
  */
  function getTextColor(color) {
    //if color is hex, convert to rgb
    color = convertColorToRGBA(color);
    const colorArray = color.substring(5, color.length - 1).split(",");
    const r = parseInt(colorArray[0]);
    const g = parseInt(colorArray[1]);
    const b = parseInt(colorArray[2]);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness > 125) {
      return colors.black;
    }
    return colors.white;
  }

  return {
    theme,
    setTheme,
    colors,
    lightenColor,
    darkenColor,
    getTextColor,
    checkTheme,
  };
}
