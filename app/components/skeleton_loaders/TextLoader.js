import React from "react";
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native";
import { color } from "react-native-reanimated";
import colors from "../../config/colors";

const MyLoader = (props) => (
  <ContentLoader
    speed={1}
    width={"100%"}
    height={400}
    viewBox="0 0 476 400"
    backgroundColor={colors.lightGray}
    foregroundColor={colors.gray}
    {...props}
  >
    <Rect x="6" y="147" rx="3" ry="3" width="421" height="6" />
    <Rect x="6" y="163" rx="3" ry="3" width="391" height="6" />
    <Rect x="6" y="179" rx="3" ry="3" width="182" height="6" />
    <Rect x="7" y="193" rx="3" ry="3" width="421" height="6" />
    <Rect x="7" y="209" rx="3" ry="3" width="391" height="6" />
    <Rect x="7" y="242" rx="3" ry="3" width="182" height="6" />
    <Rect x="6" y="225" rx="3" ry="3" width="421" height="6" />
    <Rect x="7" y="258" rx="3" ry="3" width="421" height="6" />
    <Rect x="7" y="274" rx="3" ry="3" width="391" height="6" />
    <Rect x="6" y="290" rx="3" ry="3" width="182" height="6" />
    <Rect x="8" y="304" rx="3" ry="3" width="421" height="6" />
    <Rect x="8" y="320" rx="3" ry="3" width="391" height="6" />
    <Rect x="7" y="353" rx="3" ry="3" width="182" height="6" />
    <Rect x="9" y="336" rx="3" ry="3" width="421" height="6" />
    <Rect x="7" y="7" rx="0" ry="0" width="99" height="131" />
    <Rect x="116" y="8" rx="0" ry="0" width="99" height="131" />
    <Rect x="228" y="7" rx="0" ry="0" width="99" height="131" />
    <Rect x="339" y="7" rx="0" ry="0" width="99" height="131" />
  </ContentLoader>
);

export default MyLoader;
