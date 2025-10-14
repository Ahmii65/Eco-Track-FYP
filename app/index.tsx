import useTheme from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function Index() {
  const { theme, isDark } = useTheme();
  useEffect(() => {
    const timer = setTimeout(async () => {
      router.push("/(auth)/welcome");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Animated.View entering={FadeIn.duration(1000)} style={styles.animation}>
        <Image
          source={require("../assets/images/splashImage.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  animation: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    aspectRatio: 1,
    height: "20%",
  },
});
