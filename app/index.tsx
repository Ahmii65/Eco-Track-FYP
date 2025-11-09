import useTheme from "@/hooks/useColorScheme";
import { Image, StyleSheet, View } from "react-native";

export default function Index() {
  const { theme, isDark } = useTheme();
  // useEffect(() => {
  //   const timer = setTimeout(async () => {
  //     router.push("/(auth)/welcome");
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, []);
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.animation}>
        <Image
          source={require("../assets/images/splashImage.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
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
