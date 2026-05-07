import BackButton from "@/components/BackButton";
import TouchableButton from "@/components/TouchableButton";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { At, Lock, User } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const Register = () => {
  const { top } = useSafeAreaInsets();
  const { isDark, theme } = useTheme();
  const emailRef = useRef<string>(null);
  const passwordRef = useRef<string>(null);
  const nameRef = useRef<string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { register } = useAuth();

  const handleSignUp = async () => {
    if (
      !emailRef.current?.trim() ||
      !passwordRef.current?.trim() ||
      !nameRef.current?.trim()
    ) {
      Alert.alert("SignUp", "Please fill all the fields");
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    let response = await register(
      emailRef.current,
      passwordRef.current,
      nameRef.current,
    );

    if (!response.success) {
      setLoading(false);
      Alert.alert("Registration Error", response?.msg);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[styles.main, { paddingTop: top + 10 }]}>
              {/* Header */}
              <Animated.View
                entering={FadeInDown.delay(200)
                  .duration(800)
                  .easing(Easing.out(Easing.quad))}
                style={styles.header}
              >
                <BackButton />
                <View style={styles.titleContainer}>
                  <Text style={[styles.welcomeText, { color: theme.text }]}>
                    Lets
                  </Text>
                  <Text style={[styles.welcomeText, { color: theme.text }]}>
                    Get Started
                  </Text>
                  <Text
                    style={[
                      styles.subtitle,
                      { color: isDark ? colors.neutral400 : colors.neutral600 },
                    ]}
                  >
                    Create your account to track all your Activities
                  </Text>
                </View>
              </Animated.View>

              {/* Form */}
              <View style={styles.form}>
                {/* Name Input */}
                <Animated.View
                  entering={FadeInDown.delay(400)
                    .duration(800)
                    .easing(Easing.out(Easing.quad))}
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: isDark
                        ? colors.neutral800
                        : colors.white,
                      borderColor: isDark
                        ? colors.neutral700
                        : colors.neutral400,
                      borderWidth: 1,
                      shadowColor: isDark ? "transparent" : "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0 : 0.05,
                      shadowRadius: 6,
                      elevation: isDark ? 0 : 2,
                    },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <User
                      size={verticalScale(24)}
                      color={isDark ? colors.neutral400 : colors.neutral600}
                    />
                  </View>
                  <TextInput
                    placeholder="Enter your Name"
                    placeholderTextColor={
                      isDark ? colors.neutral500 : colors.neutral400
                    }
                    style={[
                      styles.input,
                      { color: isDark ? colors.neutral300 : colors.neutral700 },
                    ]}
                    onChangeText={(value) => (nameRef.current = value)}
                  />
                </Animated.View>

                {/* Email Input */}
                <Animated.View
                  entering={FadeInDown.delay(600)
                    .duration(800)
                    .easing(Easing.out(Easing.quad))}
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: isDark
                        ? colors.neutral800
                        : colors.white,
                      borderColor: isDark
                        ? colors.neutral700
                        : colors.neutral400,
                      borderWidth: 1,
                      shadowColor: isDark ? "transparent" : "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0 : 0.05,
                      shadowRadius: 6,
                      elevation: isDark ? 0 : 2,
                    },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <At
                      size={verticalScale(24)}
                      color={isDark ? colors.neutral400 : colors.neutral600}
                    />
                  </View>
                  <TextInput
                    placeholder="Enter your Email"
                    placeholderTextColor={
                      isDark ? colors.neutral500 : colors.neutral400
                    }
                    keyboardType="email-address"
                    style={[
                      styles.input,
                      { color: isDark ? colors.neutral300 : colors.neutral700 },
                    ]}
                    onChangeText={(value) => (emailRef.current = value)}
                  />
                </Animated.View>

                {/* Password Input */}
                <Animated.View
                  entering={FadeInDown.delay(800)
                    .duration(800)
                    .easing(Easing.out(Easing.quad))}
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: isDark
                        ? colors.neutral800
                        : colors.white,
                      borderColor: isDark
                        ? colors.neutral700
                        : colors.neutral400,
                      borderWidth: 1,
                      shadowColor: isDark ? "transparent" : "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isDark ? 0 : 0.05,
                      shadowRadius: 6,
                      elevation: isDark ? 0 : 2,
                    },
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Lock
                      size={verticalScale(24)}
                      color={isDark ? colors.neutral400 : colors.neutral600}
                    />
                  </View>
                  <TextInput
                    placeholder="Enter your Password"
                    placeholderTextColor={
                      isDark ? colors.neutral500 : colors.neutral400
                    }
                    style={[
                      styles.input,
                      { color: isDark ? colors.neutral300 : colors.neutral700 },
                    ]}
                    secureTextEntry
                    onChangeText={(value) => (passwordRef.current = value)}
                  />
                </Animated.View>
              </View>

              {/* Action Buttons */}
              <View style={styles.footer}>
                <Animated.View
                  entering={FadeInDown.delay(1000)
                    .duration(800)
                    .easing(Easing.out(Easing.quad))}
                  style={{ width: "100%" }}
                >
                  <TouchableButton
                    loading={loading}
                    onPress={handleSignUp}
                    style={styles.signupButton}
                  >
                    <Text style={styles.signupButtonText}>Sign Up</Text>
                  </TouchableButton>
                </Animated.View>

                <Animated.View
                  entering={FadeInDown.delay(1200)
                    .duration(800)
                    .easing(Easing.out(Easing.quad))}
                  style={styles.loginContainer}
                >
                  <Text style={[styles.loginText, { color: theme.text }]}>
                    Already have an Account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.replace("/(auth)/Login")}
                  >
                    <Text style={[styles.loginLink, { color: colors.primary }]}>
                      Login
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(30),
  },
  main: {
    paddingHorizontal: scale(24),
  },
  header: {
    marginBottom: verticalScale(32),
  },
  titleContainer: {
    marginTop: verticalScale(24),
    gap: verticalScale(8),
  },
  welcomeText: {
    fontSize: verticalScale(32),
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: verticalScale(16),
    fontWeight: "500",
    marginTop: verticalScale(4),
  },
  form: {
    gap: verticalScale(20),
  },
  inputContainer: {
    height: verticalScale(56),
    borderWidth: 1,
    borderRadius: verticalScale(16),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
  },
  iconContainer: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    fontSize: verticalScale(15),
    fontWeight: "500",
  },
  footer: {
    marginTop: verticalScale(32),
    gap: verticalScale(24),
  },
  signupButton: {
    // No shadow
  },
  signupButtonText: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    color: colors.neutral900,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: verticalScale(14),
    fontWeight: "500",
  },
  loginLink: {
    fontSize: verticalScale(14),
    fontWeight: "700",
  },
});
