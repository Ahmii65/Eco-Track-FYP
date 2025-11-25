import BackButton from "@/components/BackButton";
import TouchableButton from "@/components/TouchableButton";
import { fireStore } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { getProfileImage, uploadToCloudinary } from "@/services/imageServices";
import { UserDataType } from "@/types";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { At, PencilSimple, User } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const EditProfile = () => {
  const { theme, isDark } = useTheme();
  const { top, bottom } = useSafeAreaInsets();
  const { user, setUser, updateUserData } = useAuth();
  const nameRef = useRef<string>(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserDataType>({
    image: null,
  });

  const handleSave = async () => {
    const nameUnchanged = nameRef.current.trim() === user?.name;
    const imageUnchanged = !userData?.image?.uri; // no new image picked

    if (nameUnchanged && imageUnchanged) {
      Alert.alert("Edit Profile", "Nothing to Update");
      setLoading(false);
      return;
    }
    if (!nameRef.current?.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      // ALWAYS define first, so it is NEVER undefined
      let uploadedImageURL = user?.image || null;

      // If user picked a new image
      if (userData?.image?.uri) {
        const updateData = await uploadToCloudinary(userData.image, "users");

        if (!updateData?.success) {
          Alert.alert("Error", updateData.msg || "Failed to upload image");
          return;
        }

        uploadedImageURL = updateData.data; // new URL
        setUserData({ image: uploadedImageURL });
      }

      // Update Firestore
      if (user?.uid) {
        await setDoc(
          doc(fireStore, "users", user.uid),
          {
            name: nameRef.current.trim(),
            image: uploadedImageURL, // ALWAYS correct
          },
          { merge: true }
        );

        // Update local auth state
        setUser({
          ...user,
          name: nameRef.current.trim(),
          image: uploadedImageURL,
        });

        Alert.alert("Success", "Profile updated successfully");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
      router.back();
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setUserData({ image: result.assets[0] });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={[
          styles.main,
          {
            backgroundColor: theme.background,
            paddingTop: top + 5,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <BackButton />
              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                  marginRight: scale(35),
                }}
              >
                <Text style={[styles.headerText, { color: theme.text }]}>
                  Edit Profile
                </Text>
              </View>
            </View>

            {/* Profile Image Section */}
            <View style={styles.profileImageSection}>
              <View
                style={[
                  styles.storyBorder,
                  {
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Image
                  source={getProfileImage(userData?.image || user?.image)}
                  contentFit="cover"
                  transition={100}
                  style={styles.profileImage}
                />
                <TouchableOpacity
                  style={[
                    styles.editButton,
                    {
                      backgroundColor: colors.neutral800,
                    },
                  ]}
                  onPress={pickImage}
                  activeOpacity={0.7}
                >
                  <PencilSimple
                    size={scale(18)}
                    color={colors.primary}
                    weight="fill"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Name Input Section */}
            <View style={styles.inputSection}>
              <Text style={[styles.label, { color: theme.text }]}>Name</Text>
              <View
                style={[
                  styles.inputView,
                  { borderColor: isDark ? colors.neutral100 : "black" },
                ]}
              >
                <View
                  style={{
                    justifyContent: "center",
                    paddingLeft: moderateScale(10),
                  }}
                >
                  <User size={verticalScale(24)} color={theme.text} />
                </View>
                <TextInput
                  placeholder="Enter your name"
                  placeholderTextColor={theme.text}
                  style={[styles.inputStyles, { color: theme.text }]}
                  onChangeText={(value) => (nameRef.current = value)}
                  defaultValue={user?.name || ""}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input Section */}
            <View style={styles.inputSection}>
              <Text style={[styles.label, { color: theme.text }]}>Email</Text>
              <View
                style={[
                  styles.inputView,
                  {
                    borderColor: isDark ? colors.neutral100 : "black",
                    opacity: 0.6,
                  },
                ]}
              >
                <View
                  style={{
                    justifyContent: "center",
                    paddingLeft: moderateScale(10),
                  }}
                >
                  <At size={verticalScale(24)} color={theme.text} />
                </View>
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor={theme.text}
                  style={[styles.inputStyles, { color: theme.text }]}
                  value={user?.email || ""}
                  editable={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: isDark ? colors.neutral700 : colors.neutral200,
            paddingHorizontal: scale(18),
            paddingTop: verticalScale(10),
            paddingBottom: bottom + verticalScale(12),
          }}
        >
          <TouchableButton loading={loading} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableButton>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(30),
  },
  headerText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: verticalScale(0.5),
  },
  profileImageSection: {
    alignItems: "center",
    marginBottom: verticalScale(40),
  },
  storyBorder: {
    width: scale(140),
    height: scale(140),
    borderRadius: scale(70),
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    padding: scale(4),
  },
  profileImage: {
    width: scale(126),
    height: scale(126),
    borderRadius: scale(63),
  },
  editButton: {
    position: "absolute",
    bottom: scale(5),
    right: scale(5),
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  inputSection: {
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: verticalScale(14),
    fontWeight: "600",
    marginBottom: verticalScale(14),
    paddingLeft: scale(4),
  },
  inputView: {
    height: verticalScale(52),
    borderWidth: 1,
    borderRadius: verticalScale(17),
    flexDirection: "row",
  },
  inputStyles: {
    paddingLeft: moderateScale(10),
    justifyContent: "center",
    flex: 1,
  },
  saveButtonText: {
    fontSize: verticalScale(16),
    fontWeight: "700",
    color: colors.neutral900,
  },
});
