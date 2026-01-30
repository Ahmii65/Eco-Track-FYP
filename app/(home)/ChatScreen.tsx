import AndroidKeyboardAvoidingView from "@/components/AndroidKeyboardAvoidingView";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { geminiCall } from "@/services/geminiService";
import { Message } from "@/types";
import { PaperPlaneRight } from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import BackButton from "../../components/BackButton";
import ChatList from "../../components/ChatList";
import TypingIndicator from "../../components/TypingIndicator";

const ChatScreen = () => {
  const { theme, isDark } = useTheme();
  const { bottom, top } = useSafeAreaInsets();
  const { messages, setMessages } = useAuth();
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [firstMessageLoading, setFirstMessageLoading] = useState(false);
  const flatListRef = useRef<any>(null);

  const fetchGeminiReply = async (userText: string) => {
    try {
      const response = await geminiCall(userText);
      const output = response?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (output) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: output,
          role: "model",
          createdAt: new Date(),
        };
        setMessages((prev) => [aiMessage, ...prev]);
      }
    } catch (error) {
      console.log(error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, something went wrong. Please try again.",
        role: "model",
        createdAt: new Date(),
      };
      setMessages((prev) => [errorMessage, ...prev]);
    } finally {
      setLoading(false);
      setFirstMessageLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      role: "user",
      createdAt: new Date(),
    };

    setMessages((prev) => [userMessage, ...prev]);
    setInput("");
    setLoading(true);
    if (messages.length === 0) setFirstMessageLoading(true);
    fetchGeminiReply(input);
  };

  const suggestedMessages = [
    "Hello!",
    "How can I save more energy?",
    "Give me eco-friendly tips",
    "Suggest sustainable habits",
  ];

  const translateX = useSharedValue(0);

  useEffect(() => {
    // Estimate width of content or just use a safe large number for 4 sets of items
    // If each item is avg 120px + 20px margin * 4 items = 560px per set.
    // We want to scroll one full set length then reset.
    // Let's assume ~600px for one set.
    translateX.value = withRepeat(
      withTiming(-800, { duration: 20000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <AndroidKeyboardAvoidingView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          paddingTop: top + 5,
          paddingHorizontal: scale(20),
          paddingBottom: bottom + 5,
          backgroundColor: theme.background,
        }}
      >
        {/* <StatusBar hidden/> */}
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
        <FlatList<Message>
          ref={flatListRef}
          contentContainerStyle={
            messages.length === 0 ? { flex: 1, justifyContent: "center" } : {}
          }
          data={messages}
          inverted={messages.length > 0}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <ChatList item={item} />;
          }}
          ListEmptyComponent={() => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: verticalScale(50),
              }}
            >
              <Text
                style={{
                  fontSize: verticalScale(20),
                  fontWeight: "600",
                  color: theme.text,
                }}
              >
                What can I help with?
              </Text>
            </View>
          )}
          ListHeaderComponent={() => (loading ? <TypingIndicator /> : null)}
        />

        {messages.length === 0 && (
          <View style={{ marginBottom: verticalScale(10), overflow: "hidden" }}>
            <Animated.View style={[{ flexDirection: "row" }, animatedStyle]}>
              {[
                ...suggestedMessages,
                ...suggestedMessages,
                ...suggestedMessages,
                ...suggestedMessages,
              ].map((msg, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setInput(msg)}
                  style={{
                    marginRight: scale(10),
                    backgroundColor: isDark ? colors.neutral800 : colors.white,
                    paddingVertical: verticalScale(10),
                    paddingHorizontal: scale(16),
                    borderRadius: scale(20),
                    borderWidth: 1,
                    borderColor: isDark ? colors.neutral700 : colors.neutral200,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      color: theme.text,
                      fontWeight: "500",
                      fontSize: 14,
                    }}
                  >
                    {msg}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>
        )}

        <View
          style={{
            height: verticalScale(55),
            justifyContent: "center",
            alignItems: "center",
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
                paddingLeft: scale(5),
                fontSize: verticalScale(13),
              }}
            />
            <TouchableOpacity
              disabled={input.length === 0 || loading}
              onPress={handleSend}
              style={[styles.icons, { backgroundColor: theme.text }]}
            >
              {firstMessageLoading && loading ? (
                <ActivityIndicator color={theme.background} size={18} />
              ) : (
                <PaperPlaneRight
                  color={theme.background}
                  size={verticalScale(25)}
                  weight="fill"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AndroidKeyboardAvoidingView>
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
