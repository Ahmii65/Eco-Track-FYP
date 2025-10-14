import useTheme from "@/hooks/useColorScheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Register = () => {
  const { top } = useSafeAreaInsets();
  const { isDark, theme } = useTheme();
  return (
    <View
      style={[
        styles.main,
        { paddingTop: top + 5, backgroundColor: theme.background },
      ]}
    >
      <Text>Register</Text>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
