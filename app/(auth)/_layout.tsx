useTheme;
import useTheme from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import React from "react";
import { View } from "react-native";

const _layout = () => {
  const { theme } = useTheme();
  return (
    <>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
          <Stack.Screen name="Login" />
          <Stack.Screen name="Register" />
          <Stack.Screen name="welcome" />
          <Stack.Screen
            name="ForgotPassword"
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
        </Stack>
      </View>
    </>
  );
};

export default _layout;
