import TouchableButton from "@/components/TouchableButton";
import { auth } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { getProfileImage } from "@/services/imageServices";
import { Image } from "expo-image";
import { router } from "expo-router";
import { signOut } from "firebase/auth";
import {
  CaretRight,
  FileText,
  Info,
  Shield,
  SignOut,
  User,
} from "phosphor-react-native";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const Profile = () => {
  const { theme, isDark } = useTheme();
  const { top } = useSafeAreaInsets();
  const { user } = useAuth();
  const [loading, setloading] = useState<boolean>(false);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "destructive",
          onPress: async () => {
            setloading(true);
            await signOut(auth);
            setloading(false);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      label: "Edit Profile",
      icon: User,
      onPress: () => {
        {
          router.push("/EditProfile");
        }
      },
    },
    {
      label: "Privacy Policy",
      icon: Shield,
      onPress: () => {
        router.push("/PrivacyPolicy");
      },
    },
    {
      label: "Terms and Conditions",
      icon: FileText,
      onPress: () => {
        router.push("/TermsAndConditions");
      },
    },
    {
      label: "About App",
      icon: Info,
      onPress: () => {
        router.push("/AboutApp");
      },
    },
  ];

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
      <Text
        style={{
          fontSize: verticalScale(18),
          color: theme.text,
          fontWeight: 700,
          alignSelf: "center",
          letterSpacing: verticalScale(0.5),
          paddingTop: verticalScale(4),
          marginBottom: verticalScale(12),
        }}
      >
        Profile
      </Text>
      <View style={{ marginTop: verticalScale(10) }}>
        {/* Instagram Story Style Profile Image */}
        <View
          style={[
            styles.storyBorder,
            {
              borderColor: colors.primary,
            },
          ]}
        >
          <Image
            source={getProfileImage(user?.image)}
            contentFit="cover"
            transition={100}
            style={styles.profileImage}
          />
        </View>
        <Text style={[styles.text, { color: theme.text }]}>{user?.name}</Text>
        {/* <Text style={[styles.text1, { color: theme.text }]}>{user?.email}</Text> */}
      </View>

      {/* Menu Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Account
        </Text>
        <View
          style={[
            styles.menuContainer,
            {
              backgroundColor: isDark ? colors.neutral800 : colors.white,
            },
          ]}
        >
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isLastItem = index === menuItems.length - 1;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  !isLastItem && {
                    borderBottomWidth: 1,
                    borderBottomColor: isDark
                      ? colors.neutral700
                      : colors.neutral200,
                  },
                ]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuItemLeft}>
                  <IconComponent
                    size={scale(18)}
                    color={theme.text}
                    weight="regular"
                  />
                  <Text style={[styles.menuItemText, { color: theme.text }]}>
                    {item.label}
                  </Text>
                </View>
                <CaretRight
                  size={scale(18)}
                  color={colors.neutral500}
                  weight="bold"
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableButton loading={loading} onPress={handleSignOut}>
          <View style={styles.logoutButtonContent}>
            <SignOut size={scale(16)} color={colors.neutral900} weight="bold" />
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </View>
        </TouchableButton>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20), gap: verticalScale(20) },
  storyBorder: {
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: verticalScale(8),
    padding: scale(4),
  },
  profileImage: {
    width: scale(106),
    height: scale(106),
    borderRadius: scale(53),
  },
  text: {
    fontSize: verticalScale(22),
    fontWeight: 700,
    alignSelf: "center",
    letterSpacing: verticalScale(0.3),
    marginTop: verticalScale(4),
  },
  text1: {
    fontSize: verticalScale(12),
    fontWeight: 300,
    alignSelf: "center",
    letterSpacing: verticalScale(0.2),
    marginTop: verticalScale(2),
  },
  section: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: verticalScale(14),
    fontWeight: "700",
    marginBottom: verticalScale(14),
    letterSpacing: verticalScale(0.3),
    paddingLeft: scale(4),
  },
  menuContainer: {
    borderRadius: scale(12),
    overflow: "hidden",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: verticalScale(12),
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(15),
  },
  menuItemText: {
    fontSize: verticalScale(14),
    fontWeight: "500",
  },
  logoutSection: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(10),
  },
  logoutButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  logoutButtonText: {
    fontSize: verticalScale(14),
    fontWeight: "700",
    color: colors.neutral900,
  },
});
