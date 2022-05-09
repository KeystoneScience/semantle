import React from "react";
import SVG, { Text } from "react-native-svg";

let colorFillString = "rgba(0,0,0";
export default function AnimatedText({
  children,
  fontSize = 35,
  fontWeight = 500,
  color = "#FFF",
  strokeColor = color,
  height = 300,
  timeToComplete = 7000,
  scale,
  timeToFade = timeToComplete,
  textAnchor = "middle",
}) {
  // using state because it causes a re-render
  const [strokeDashoffsetState, setStrokeDashoffsetState] =
    React.useState(1000);
  const [fillOpacityState, setFillOpacityState] = React.useState(0);

  if (scale) {
    if (children) {
      const scaleFactor = scale.length / children.length;
      fontSize = fontSize * scaleFactor;
    }
  }
  //function to convert color from hex to rgb
  const hexToRgb = (hex) => {
    //check if hex is valid
    if (hex.charAt(0) !== "#") {
      if (hex.charAt(0) === "r") {
        return "rgb(" + hex.substring(4, hex.length - 1);
      }
      return "rgba(255,255,255";
    }

    //check if hex is #FFF or #000
    if (hex === "#FFF" || hex === "#000") {
      if ((hex = "#FFF")) {
        return "rgba(255,255,255";
      } else {
        return "rgba(0,0,0";
      }
    }

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgbValues = result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
    return `rgba(${rgbValues.r}, ${rgbValues.g}, ${rgbValues.b}`;
  };

  React.useEffect(() => {
    colorFillString = hexToRgb(color);
  }, [color]);

  React.useEffect(() => {
    //animate strokeDashoffsetState linearly from 1000 to 0
    const interval = setInterval(() => {
      if (strokeDashoffsetState > 0) {
        setStrokeDashoffsetState(strokeDashoffsetState - 10);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [strokeDashoffsetState]);

  React.useEffect(() => {
    //animate fillopacityState linearly from 0 to 1
    const interval = setInterval(() => {
      if (fillOpacityState < 1) {
        setFillOpacityState(fillOpacityState + 0.025);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [fillOpacityState]);

  return (
    <SVG width={"100%"} height={height}>
      <Text
        textAnchor={textAnchor}
        alignmentBaseline="top"
        x={textAnchor === "middle" ? "50%" : "0"}
        fill={`${colorFillString}, ${fillOpacityState})`}
        stroke={strokeColor}
        strokeWidth="1"
        fontSize={fontSize}
        fontWeight={"bold"}
        strokeDasharray="1000"
        strokeDashoffset={strokeDashoffsetState}
      >
        {children}
      </Text>
    </SVG>
  );
}
