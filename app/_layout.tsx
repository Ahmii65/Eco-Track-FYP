import { AuthProvider } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

const StackLayout = () => {
  const { theme } = useTheme();
  return (
    <>
      <StatusBar style="auto" animated />
      <View style={{ backgroundColor: theme.background, flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
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
