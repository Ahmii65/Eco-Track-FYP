import { AuthProvider } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

// SplashScreen.preventAutoHideAsync();
const StackLayout = () => {
  const { theme } = useTheme();
  // useEffect(() => {
  //   SplashScreen.hideAsync();
  // }, []);
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
