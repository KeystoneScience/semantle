import { DefaultTheme } from "@react-navigation/native";
import colors from "../configs/colors";

export default {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.colors.grooveColorPallet[2],
    background: colors.colors.background,
  },
};
