import { t } from "i18n-js";
import React, { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import Header from "../../components/Header";
import colors from "../../config/colors";
import ChatFooter from "./ChatFooter";
import Message from "./Message";
import ShareScreen from "../ShareScreen";
import useApi from "../../hooks/useApi";
import chat from "../../api/chat";
import cache from "../../utility/cache";
import { useIsFocused } from "@react-navigation/native";
import i18n from "i18n-js";
import AppText from "../../components/AppText";
var ws;

var lastTimeStamp = "";
var inChat = true;

export default function Room({ navigation, route }) {
  var messagesForCache = [];
  const [messages, setMessages] = useState([]);
  const [shareVisible, setShareVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const groupID = route.params.groupID;
  const chatAPI = useApi(chat.getChat);
  var scrollRef = useRef();
  const isFocused = useIsFocused();

  async function storeLatestChat(chatID) {
    cache.storeData(
      "FLIXPIX::" + route.params.groupID + "::lastMessage",
      chatID
    );
    // var messageArrayToStore = messagesForCache;
    // const reverseMessageArrayToStore = messageArrayToStore.reverse();
    // cache.storeData("FLIXPIX::" + route.params.groupID + "::messages",{data:{chat:{Items: reverseMessageArrayToStore}}});

  }

  useEffect(() => {
    inChat = true;
    requestChat();
    if (!ws || ws.readyState != WebSocket.OPEN) {
      ws = new WebSocket(
        "wss://x644xbwb0d.execute-api.us-east-1.amazonaws.com/staging?userid=tony&groupid=" +
          groupID
      );
    }
    setWebsocketStates();
  }, []);

  function setWebsocketStates() {
    ws.onopen = () => {
      console.log("CONNECTED");
      inChat = true;
    };

    ws.onmessage = (e) => {
      // a message was received
      if (e.data.includes("{")) {
        const jsonObj = JSON.parse(e.data.replace(/\'/g, '"'));
        if (groupID === jsonObj.groupID) {
          storeLatestChat(jsonObj.Message + jsonObj.SenderID);
          if (jsonObj.Message + jsonObj.SenderID === lastTimeStamp) {
            lastTimeStamp = "";
          } else {
            setMessages((oldArray) => [...oldArray, jsonObj]);
            messagesForCache = [...messagesForCache, jsonObj];
          }
        }
      } else if (e.data.includes("Message Delivered")) {
      }
    };

    ws.onerror = (e) => {
      console.log(e);
    };

    ws.onclose = (e) => {
      console.log(e)
      if (isFocused && inChat) {
        ws = new WebSocket(
          "wss://x644xbwb0d.execute-api.us-east-1.amazonaws.com/staging?userid=tony&groupid=" +
            groupID
        );
        setWebsocketStates();
      }
    };
  }

  function toUnicode(str) {
    return str
      .split("")
      .map(function (value, index, array) {
        var temp = value.charCodeAt(0).toString(16).toUpperCase();
        if (temp.length > 2) {
          return "\\u" + temp;
        }
        return value;
      })
      .join("");
  }

  function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
    });
  }

  const requestChat = async (showLoad = true, force = false) => {
    if (showLoad) {
      setLoading(true);
    }
    let response;
    if (!force) {
      response = await cache.getData(
        "FLIXPIX::" + route.params.groupID + "::messages",
        true,
        1
      );
      if (!response || !response.data || !response.data.chat) {
        response = await chatAPI.request(route.params.groupID);
        if (!response.data || !response.data.chat) {
          Alert.alert(i18n.t("Network Error"));
          setLoading(false);
          return;
        }
        cache.storeData(
          "FLIXPIX::" + route.params.groupID + "::messages",
          response
        );
      }
    } else {
      response = await chatAPI.request(route.params.groupID);
      if (!response.data || !response.data.chat) {
        Alert.alert(i18n.t("Network Error"));
        setLoading(false);
        return;
      }
      cache.storeData(
        "FLIXPIX::" + route.params.groupID + "::messages",
        response
      );
    }
    if (response.data && response.data.chat) {
      const reverseMessages = response.data.chat.Items.reverse();
      setMessages((oldArray) => [...reverseMessages, ...oldArray]);
      messagesForCache = [...reverseMessages, ...messagesForCache];
      if (
        reverseMessages.length > 0 &&
        reverseMessages[reverseMessages.length - 1].Message &&
        reverseMessages[reverseMessages.length - 1].SenderID
      ) {
        storeLatestChat(
          reverseMessages[reverseMessages.length - 1].Message +
            reverseMessages[reverseMessages.length - 1].SenderID
        );
      }
      if (showLoad) {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        display: "flex",
        backgroundColor: colors.background,
        height: "100%",
        position: "relative",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Header
        backVisible={true}
        groupInfoVisble={true}
        onGroupInfoPress={() => {
          setShareVisible(true);
        }}
        onBackPress={() => {
          inChat = false;
          ws.close();
          navigation.navigate("Swipe");
        }}
      />
      <Text numberOfLines={1} style={{color: colors.primary, fontSize:14,fontWeight:'700', textAlign:'center', zIndex:100, marginTop:-7,   
      textShadowColor: 'rgba(0, 0, 0, 1)', paddingHorizontal:10,
  textShadowRadius: 10}}>{route.params.name}</Text>
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() => {
          if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: false });
          }
        }}
        keyboardDismissMode="interactive"
        style={{ overflow: "visible" }}
      >
        {messages.map((message, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {}}
            style={{ width: "100%" }}
          >
            <Message
              timestamp={message.timestamp}
              picture="https://media-exp1.licdn.com/dms/image/C5603AQGG6ldcC3m5Aw/profile-displayphoto-shrink_400_400/0/1602037994612?e=1626307200&v=beta&t=4IIJx0vEdAbpNrskW6Ad5TKuhJSdfsQtQjQG6iQT6YM"
              username={unicodeToChar(message.SenderID)}
              message={unicodeToChar(message.Message)}
            />
          </TouchableOpacity>
        ))}
        <View style={{ padding: 10 }}></View>
      </ScrollView>
      <View
        style={{
          bottom: 0,
        }}
      >
        <ChatFooter
          onSend={async (message) => {
            if (ws.readyState == WebSocket.OPEN) {
              const screenName = await cache.getData(
                "FLIXPIX::SCREENNAME",
                false
              );
              const messagePackage = {
                Msg: toUnicode(message),
                SenderID: toUnicode(screenName),
                ReceiverID: groupID,
                action: "sendmsg",
              };
              lastTimeStamp = messagePackage.Msg + messagePackage.SenderID;
              ws.send(JSON.stringify(messagePackage)); // send a message
              setMessages((oldArray) => [
                ...oldArray,
                {
                  Message: toUnicode(message),
                  SenderID: toUnicode(screenName),
                  timestamp: Date.now()/1000,
                },
              ]);
            }
          }}
          onInteract={() => {
            scrollRef.current.scrollToEnd({ animated: true });
          }}
          onfocus={
            () => {
              scrollRef.current.scrollToEnd({ animated: true });
          }}
        />
        <View
          style={{ backgroundColor: colors.fg06, width: "100%", height: 5 }}
        ></View>
      </View>
      <View
        pointerEvents="box-none"
        style={{
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
        }}
      >
        <Modal animationType="fade" transparent={true} visible={shareVisible}>
          <ShareScreen
            onClose={() => {
              setShareVisible(false);
            }}
            groupName={route.params.name}
            groupID={route.params.groupID}
          ></ShareScreen>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
