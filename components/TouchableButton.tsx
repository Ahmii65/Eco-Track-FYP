import { colors } from "@/constants/theme";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { verticalScale } from "react-native-size-matters";

interface ButtonProps {
  loading: boolean;
  children: ReactNode;
  onPress?: () => void;
}

const TouchableButton = ({ loading, children, onPress }: ButtonProps) => {
  if (loading) {
    return (
      <View style={[styles.startedButton, { backgroundColor: "transparent" }]}>
        <ActivityIndicator size={"large"} color={colors.primary} />
      </View>
    );
  }
  return (
    <TouchableOpacity style={styles.startedButton} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default TouchableButton;

const styles = StyleSheet.create({
  startedButton: {
    backgroundColor: colors.primary,
    height: verticalScale(50),
    width: "100%",
    borderRadius: verticalScale(17),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
  },
});
