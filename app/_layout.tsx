import { AuthProvider } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { processNotifications } from "@/services/notificationService";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

// SplashScreen.preventAutoHideAsync();
const StackLayout = () => {
  const { theme } = useTheme();

  useEffect(() => {
    processNotifications();
  }, []);

  return (
    <>
      {/* <StatusBar style="auto" animated /> */}
      <View style={{ backgroundColor: theme.background, flex: 1 }}>
        {/* <StatusBar animated style="auto" /> */}
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
            }}
          />
        </AuthProvider>
      </View>
    </>
  );
};
export default StackLayout;
