import { AuthProvider } from "@/contexts/authContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import useTheme from "@/hooks/useColorScheme";
import { processNotifications } from "@/services/notificationService";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

// SplashScreen.preventAutoHideAsync();
const AppContent = () => {
  const { theme } = useTheme();

  useEffect(() => {
    processNotifications();
  }, []);

  return (
    <View style={{ backgroundColor: theme.background, flex: 1 }}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        />
      </AuthProvider>
    </View>
  );
};

const RootLayout = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default RootLayout;
