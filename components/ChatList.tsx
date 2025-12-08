import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { Message } from "@/types";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";

const ChatList = ({ item }: { item: Message }) => {
  const { theme, isDark } = useTheme();
  const isUser = item.role === "user";

  return (
    <View
      style={[
        styles.container,
        {
          justifyContent: isUser ? "flex-end" : "flex-start",
        },
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isUser
              ? theme.text
              : isDark
              ? colors.neutral800
              : colors.neutral200,
            borderBottomRightRadius: isUser ? 0 : verticalScale(15),
            borderBottomLeftRadius: isUser ? verticalScale(15) : 0,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: isUser ? theme.background : theme.text,
            },
          ]}
        >
          {item.text}
        </Text>
      </View>
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: verticalScale(5),
    width: "100%",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    borderRadius: verticalScale(15),
  },
  text: {
    fontSize: verticalScale(14),
    lineHeight: verticalScale(20),
  },
});
