import AndroidKeyboardAvoidingView from "@/components/AndroidKeyboardAvoidingView";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { geminiCall } from "@/services/geminiService";
import { Message } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { PaperPlaneRight } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
import { StatusBar } from "expo-status-bar";

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
    // "Track my daily emissions",
    "Suggest sustainable habits",
  ];
  const gradients = [
    ["#86efac", "#22c55e"], // Green
    ["#7dd3fc", "#0ea5e9"], // Blue
    ["#fda4af", "#e11d48"], // Rose
    ["#fde047", "#eab308"], // Yellow
    ["#c4b5fd", "#7c3aed"], // Violet
  ];

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
          contentContainerStyle={messages.length === 0 ? { flex: 1 } : {}}
          data={messages}
          inverted={messages.length > 0}
          // style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <ChatList item={item} />;
          }}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingTop: verticalScale(20),
              }}
            >
              <Text
                style={{
                  fontSize: verticalScale(20),
                  fontWeight: "600",
                  color: theme.text,
                  marginBottom: verticalScale(20),
                }}
              >
                What can I help with?
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {suggestedMessages.map((msg, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setInput(msg)}
                    style={{
                      margin: scale(5),
                    }}
                  >
                    <LinearGradient
                      colors={gradients[idx % gradients.length] as any}
                      style={{
                        paddingVertical: verticalScale(12),
                        paddingHorizontal: scale(20),
                        borderRadius: scale(20),
                      }}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text
                        style={{
                          color: colors.white,
                          textAlign: "center",
                          fontWeight: "500",
                          fontSize: 16,
                        }}
                      >
                        {msg}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          ListHeaderComponent={() => (loading ? <TypingIndicator /> : null)}
        />
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
