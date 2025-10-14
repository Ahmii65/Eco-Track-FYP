import { colors } from "@/constants/theme";
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
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={router.back}>
      <CaretLeft
        color={colors.white}
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
    backgroundColor: colors.neutral600,
    padding: moderateScale(5),
    borderRadius: verticalScale(12),
  },
});
