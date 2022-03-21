import React from "react";

function AppText(props) {
  return (
    <Text
      style={[
        {
          FontFace: "Roboto",
        },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
}

export default AppText;
