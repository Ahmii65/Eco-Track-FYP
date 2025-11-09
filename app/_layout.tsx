import { AuthProvider } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { StatusBar, View } from "react-native";
const StackLayout = () => {
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
        ></Stack>
      </View>
    </>
  );
};
export default function RootLayout() {
  return (
    <AuthProvider>
      <StackLayout />
    </AuthProvider>
  );
}
