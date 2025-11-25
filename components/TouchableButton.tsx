import { colors } from "@/constants/theme";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { verticalScale } from "react-native-size-matters";

interface ButtonProps {
  loading?: boolean;
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const TouchableButton = ({
  loading,
  children,
  onPress,
  style,
}: ButtonProps) => {
  if (loading) {
    return (
      <View
        style={[
          styles.startedButton,
          style,
          { backgroundColor: "transparent" },
        ]}
      >
        <ActivityIndicator size={verticalScale(22)} color={colors.primary} />
      </View>
    );
  }
  return (
    <TouchableOpacity style={[styles.startedButton, style]} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default TouchableButton;

const styles = StyleSheet.create({
  startedButton: {
    backgroundColor: colors.primary,
    padding: verticalScale(14),
    borderRadius: verticalScale(17),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
  },
});
