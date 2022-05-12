import React from "react";
import { View, Text, Modal, Linking, Alert } from "react-native";
import * as Network from "expo-network";
import AppText from "./AppText";
import { Feather } from "@expo/vector-icons";
function OfflineNotice(props) {
  const [isConnected, setIsConnected] = React.useState(true);
  React.useEffect(() => {
    //every second, ping google.com to see if we are connected
    const checkInternet = () => {
      Linking.canOpenURL("https://www.google.com/").then((connection) => {
        if (!connection) {
          setIsConnected(false);
        } else {
          fetch("https://www.google.com/")
            .then((res) => {
              setIsConnected(res.status !== 200 ? false : true);
            })
            .catch((err) => {
              setIsConnected(false);
            });
        }
      });
    };

    const interval = setInterval(checkInternet, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isConnected}
        //   onRequestClose={() => {
        //     setModalVisible(!customThemeModal);
        //   }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.98)",
              borderRadius: 10,
              padding: 10,
              width: "80%",
              height: "50%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="wifi-off" size={200} color="rgba(0,0,0,.6)" />
            <AppText style={{ color: "rgba(0,0,0,.8)", fontSize: 20 }}>
              You're currently offline
            </AppText>
            <AppText
              style={{
                color: "rgba(0,0,0,.6)",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              Make sure wifi or data is turned on and try again.
            </AppText>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default OfflineNotice;
