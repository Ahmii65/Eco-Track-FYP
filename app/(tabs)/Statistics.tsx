import useTheme from "@/hooks/useColorScheme";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
const Statistics = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: theme.background,
          paddingTop: top + 5
        },
      ]}
    ></View>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20), gap: verticalScale(20) },
});
