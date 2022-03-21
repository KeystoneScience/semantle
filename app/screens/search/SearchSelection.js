import React from "react";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { View } from "react-native";
import AppText from "../../components/AppText";
import colors from "../../config/colors";

const tabs = ["Movies", "TV Shows", "People"];

export default function ({ onSelect }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  return (
    <View>
      <ScrollView horizontal={true}>
        {tabs.map((title, index) => (
          <TouchableOpacity
            style={{
              paddingRight: 30,
              paddingLeft: 15,
              display: "flex",
              justifyContent: "center",
            }}
            onPress={() => {
              setSelectedIndex(index);
              onSelect(index);
            }}
          >
            <AppText
              style={{
                color: selectedIndex === index ? colors.primary : colors.white,
                fontSize: 18,
              }}
            >
              {title}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
