import useTheme from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { StatusBar, View } from "react-native";

export default function RootLayout() {
  const { isDark, theme } = useTheme();
  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />
      <View style={{ backgroundColor: theme.background, flex: 1 }}>
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        >
          <Stack.Screen name="index" />
        </Stack>
      </View>
    </>
  );
}
