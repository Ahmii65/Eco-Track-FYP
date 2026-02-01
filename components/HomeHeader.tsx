import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { getProfileImage } from "@/services/imageServices";
import { Image } from "expo-image";
import { BellSimple } from "phosphor-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
const HomeHeader = () => {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  return (
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
          <Text style={[styles.greeting, { color: theme.text }]}>Hello 👋</Text>
          <Text style={[styles.userName, { color: theme.text }]}>
            {user?.name}
          </Text>
        </View>
      </View>
      {/* <TouchableOpacity
        style={[
          styles.notificationButton,
          {
            backgroundColor: isDark ? colors.neutral700 : colors.neutral200,
            borderColor: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.08)",
          },
        ]}
      >
        <BellSimple size={scale(22)} color={theme.text} />
      </TouchableOpacity> */}
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
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
