import useTheme from "@/hooks/useColorScheme";
import { Image, StyleSheet, View } from "react-native";

export default function Index() {
  const { theme } = useTheme();
  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     router.replace("/(tabs)");
  //   }, 2000);
  //   return () => clearTimeout(timeout);
  // }, []);
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.animation}>
        <Image
          source={require("../assets/images/Eco-Logo.png")}
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
