import BackButton from "@/components/BackButton";
import TouchableButton from "@/components/TouchableButton";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useTheme from "@/hooks/useColorScheme";
import { router } from "expo-router";
import { At, Lock } from "phosphor-react-native";
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
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const Login = () => {
  const { top } = useSafeAreaInsets();
  const { isDark, theme } = useTheme();
  const emailRef = useRef<string>(null);
  const passwordRef = useRef<string>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!emailRef.current?.trim() || !passwordRef.current?.trim()) {
      Alert.alert("SignIn", "Please fill all the fields");
      return;
    }
    setLoading(true);
    let response = await login(emailRef.current, passwordRef.current);
    setLoading(false);
    if (!response.success) {
      Alert.alert("Login Error", response?.msg);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.Container, { backgroundColor: theme.background }]}>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: theme.background }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ backgroundColor: theme.background }}
          >
            <View
              style={{
                paddingHorizontal: scale(20),
                gap: verticalScale(20),
                paddingTop: top + 5,
              }}
            >
              <BackButton />
              <View style={{ marginTop: verticalScale(20), gap: 5 }}>
                <Text style={[styles.text, { color: theme.text }]}>Hey,</Text>
                <Text style={[styles.text, { color: theme.text }]}>
                  Welcome Back
                </Text>
                <Text
                  style={{
                    color: theme.text,
                    fontSize: verticalScale(16),
                    fontWeight: "500",
                    paddingTop: verticalScale(5),
                  }}
                >
                  Login now to track all your Activities
                </Text>
              </View>
              {/* Form */}
              <View style={styles.form}>
                {/* Input */}
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
                    <At size={verticalScale(24)} color={theme.text} />
                  </View>
                  <TextInput
                    placeholder="Enter your Email"
                    placeholderTextColor={theme.text}
                    keyboardType="email-address"
                    style={[styles.inputStyles, { color: theme.text }]}
                    onChangeText={(value) => (emailRef.current = value)}
                  />
                </View>
                {/* Input 2 */}
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
                    <Lock size={verticalScale(24)} color={theme.text} />
                  </View>
                  <TextInput
                    placeholder="Enter your Password"
                    placeholderTextColor={theme.text}
                    style={[styles.inputStyles, { color: theme.text }]}
                    secureTextEntry
                    onChangeText={(value) => (passwordRef.current = value)}
                  />
                </View>
              </View>

              <Text
                style={{
                  color: theme.text,
                  alignSelf: "flex-end",
                  paddingRight: 10,
                  fontSize: verticalScale(13),
                  fontWeight: 500,
                }}
                onPress={() => router.push("/(auth)/ForgotPassword")}
              >
                Forgot Password?
              </Text>
              <TouchableButton loading={loading} onPress={handleLogin}>
                <Text
                  style={{
                    fontWeight: "700",
                    fontSize: 20,
                    color: colors.neutral900,
                  }}
                >
                  Login
                </Text>
              </TouchableButton>
              <Text
                style={{
                  color: theme.text,
                  alignSelf: "center",
                  fontSize: verticalScale(13),
                  fontWeight: 500,
                }}
              >
                Dont have an Account?{" "}
                <Text
                  style={{ fontWeight: 500, color: colors.primary }}
                  onPress={() => router.replace("/(auth)/Register")}
                >
                  SignUp
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(30),
  },
  text: {
    fontSize: verticalScale(28),
    fontWeight: "800",
  },
  form: {
    gap: verticalScale(20),
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
});
