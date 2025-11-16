import { AuthProvider } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View } from "react-native";

// Prevent the default splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();
const StackLayout = () => {
  const { isDark, theme } = useTheme();

  useEffect(() => {
    // Hide the default splash screen immediately to show custom splash
    SplashScreen.hideAsync();

    // StatusBar style handled by expo-status-bar component below,
    // but for nav bar we must set it explicitly on Android.
    async function applySystemBars() {
      if (Platform.OS === "android") {
        try {
          // set navigation bar background color (match your app background)
          // await NavigationBar.setBackgroundColorAsync(
          //   isDark ? colors.neutral900 : "#ffffff"
          // );

          // set nav bar button/icon style:
          // - use "light" icons on dark background
          // - use "dark" icons on light background
          await NavigationBar.setButtonStyleAsync(isDark ? "light" : "dark");
        } catch (e) {
          // ignore if API not available on some Android versions
          console.warn("NavigationBar set failed", e);
        }
      }
    }
    applySystemBars();
  }, [isDark]);
  return (
    <>
      <StatusBar style="auto" animated />
      <View style={{ backgroundColor: theme.background, flex: 1 }}>
        <Stack
          screenOptions={{ headerShown: false, animation: "slide_from_right" }}
        />
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
