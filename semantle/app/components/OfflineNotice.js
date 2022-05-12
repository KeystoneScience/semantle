import React from "react";
import { View, Text, Modal } from "react-native";
import * as Network from "expo-network";
import AppText from "./AppText";
import { Feather } from "@expo/vector-icons";
function OfflineNotice(props) {
  const [isConnected, setIsConnected] = React.useState(false);
  React.useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    const connect = await Network.getNetworkStateAsync();
    if (connect.isConnected) {
      console.log("Network is connected");
      console.log(connect.type);
      console.log(connect.isConnected);
      setIsConnected(true);
    } else {
      console.log("Network is not connected");
      console.log(connect.type);
      setIsConnected(false);
      console.log(connect.isConnected);
    }
  }

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={!isConnected}
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
            <Feather name="wifi-off" size={200} color="grey" />
            <AppText style={{ color: "grey", fontSize: 20 }}>
              no internet connection.
            </AppText>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default OfflineNotice;
