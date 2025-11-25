import { colors } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const Loading = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={35} color={colors.primary} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
