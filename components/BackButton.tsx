import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { CaretLeft } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";

interface BackButtonProps {
  style?: ViewStyle;
  iconSize?: number;
}

const BackButton = ({ iconSize = 28, style }: BackButtonProps) => {
  const { isDark } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        {
          backgroundColor: isDark ? colors.neutral600 : "rgba(10,10,10,0.09)",
        },
      ]}
      onPress={router.back}
    >
      <CaretLeft
        color={isDark ? colors.white : "black"}
        size={verticalScale(iconSize)}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: moderateScale(5),
    borderRadius: verticalScale(12),
  },
});
