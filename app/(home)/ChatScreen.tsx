import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { geminiCall } from "@/services/geminiService";
import { Message } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { PaperPlaneRight } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import BackButton from "../../components/BackButton";
import ChatList from "../../components/ChatList";
import TypingIndicator from "../../components/TypingIndicator";

const ChatScreen = () => {
  const { theme, isDark } = useTheme();
  const { bottom, top } = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<any>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      role: "user",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await geminiCall(input);
      const output = response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (output) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: output,
          role: "model",
          createdAt: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.log(error);
      // Optional: Add error message to chat
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   AvoidSoftInput.setAdjustNothing();
  //   AvoidSoftInput.setEnabled(true);

  //   const showSub = AvoidSoftInput.onSoftInputShown(
  //     (e: { softInputHeight: number }) => {
  //       setKeyboardHeight(e.softInputHeight);
  //     }
  //   );

  //   const hideSub = AvoidSoftInput.onSoftInputHidden(() => {
  //     setKeyboardHeight(0);
  //   });

  //   return () => {
  //     showSub?.remove?.();
  //     hideSub?.remove?.();
  //     AvoidSoftInput.setEnabled(false);
  //   };
  // }, []);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: top + 5,
        paddingHorizontal: scale(20),
        paddingBottom: bottom + 5,
      }}
    >
      <View style={styles.header}>
        <BackButton />
        <View
          style={{
            alignItems: "center",
            flex: 1,
            marginRight: scale(35),
          }}
        >
          <Text style={[styles.headerText, { color: theme.text }]}>Chat</Text>
        </View>
      </View>
      <FlashList<Message>
        ref={flatListRef}
        data={messages}
        maintainVisibleContentPosition={{
          autoscrollToBottomThreshold: 50,
          animateAutoScrollToBottom: true,
          startRenderingFromBottom: true,
        }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return <ChatList item={item} />;
        }}
        ListFooterComponent={() => (loading ? <TypingIndicator /> : null)}
      />
      <View
        style={{
          paddingBottom: keyboardHeight,
        }}
      >
        <View
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? colors.neutral800 : colors.neutral200,
            },
          ]}
        >
          <TextInput
            placeholder="Type your message..."
            placeholderTextColor={theme.text}
            onChangeText={(text) => {
              setInput(text);
            }}
            value={input}
            style={{
              color: theme.text,
              flex: 1,
              fontSize: verticalScale(13),
            }}
          />
          <TouchableOpacity
            disabled={input.length === 0 || loading}
            onPress={handleSend}
            style={[styles.icons, { backgroundColor: theme.text }]}
          >
            <PaperPlaneRight
              color={theme.background}
              size={verticalScale(25)}
              weight="fill"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  headerText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: verticalScale(0.5),
  },
  textInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: scale(2),
    paddingLeft: scale(15),
    borderRadius: verticalScale(25),
    height: verticalScale(45),
  },
  icons: {
    height: scale(42),
    overflow: "hidden",
    width: scale(42),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: scale(21),
  },
});
