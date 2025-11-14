import BackButton from "@/components/BackButton";
import TouchableButton from "@/components/TouchableButton";
import { auth } from "@/config/firebase";
import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { sendPasswordResetEmail } from "firebase/auth";
import { At } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
const ForgotPassword = () => {
  const { theme, isDark } = useTheme();
  const { top } = useSafeAreaInsets();
  const emailRef = useRef<string>(null);
  const [loading, setloading] = useState<boolean>(false);
  const handleReset = async () => {
    if (!emailRef.current?.trim()) {
      Alert.alert("Reset Password", "Please enter your email");
      return;
    }

    try {
      setloading(true);
      await sendPasswordResetEmail(auth, emailRef.current.trim());
      setloading(false);
      Alert.alert(
        "Reset Password",
        "If this email is registered, a reset link has been sent."
      );
    } catch (error: any) {
      let msg = error.message;
      switch (msg) {
        case "Firebase: Error (auth/invalid-email).":
          msg = "Invalid email address";
          break;
        default:
          msg = "Failed to send reset email. Please try again.";
          break;
      }
      Alert.alert("Reset Password", msg);
      setloading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
      <View
        style={[
          styles.main,
          {
            backgroundColor: theme.background,
            paddingTop: top + 5,
          },
        ]}
      >
        <BackButton />

        <Text
          style={{
            color: theme.text,
            fontWeight: "800",
            fontSize: verticalScale(24),
          }}
        >
          Did you forget your password?
        </Text>
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
        <TouchableButton loading={loading} onPress={handleReset}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 20,
              color: colors.neutral900,
            }}
          >
            Send Link
          </Text>
        </TouchableButton>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20), gap: verticalScale(20) },
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
