import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { getProfileImage } from "@/services/imageServices";
import { Image } from "expo-image";
import * as Icons from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const Home = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.main,
        {
          backgroundColor: theme.background,
          paddingTop: top + 5,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.userSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              Hello,
            </Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user?.name || "EcoTrack User"}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.notificationButton,
            {
              backgroundColor: isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(0,0,0,0.06)",
              borderColor: isDark
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.08)",
            },
          ]}
        >
          <Icons.BellSimple size={scale(22)} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20), gap: verticalScale(20) },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  avatarWrapper: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  greeting: {
    fontSize: verticalScale(12),
    opacity: 0.7,
  },
  userName: {
    fontSize: verticalScale(16),
    fontWeight: "700",
  },
  notificationButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: verticalScale(15),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
