import BackButton from "@/components/BackButton";
import useTheme from "@/hooks/useColorScheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";

const Login = () => {
  const { top } = useSafeAreaInsets();
  const { isDark, theme } = useTheme();
  return (
    <View
      style={[
        styles.main,
        { paddingTop: top + 5, backgroundColor: theme.background },
      ]}
    >
      <BackButton />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
});
