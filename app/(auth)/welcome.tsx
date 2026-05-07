import TouchableButton from "@/components/TouchableButton";
import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const Welcome = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { isDark, theme } = useTheme();

  const scaleAnim = useSharedValue(1);

  useEffect(() => {
    scaleAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1, // Infinite repeat
      true, // Reverse
    );
  }, []);

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        { paddingTop: top, backgroundColor: theme.background },
      ]}
    >
      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        {/* Animated Hero Image */}
        <View style={styles.imageContainer}>
          <Animated.View
            style={{
              flex: 1,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            entering={FadeInDown.duration(800).easing(Easing.out(Easing.quad))}
          >
            <Animated.Image
              source={require("../../assets/images/welcome.png")}
              resizeMode="contain"
              style={[styles.welcomeImage, animatedImageStyle]}
            />
          </Animated.View>
        </View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Animated.View
            entering={FadeInDown.delay(200)
              .duration(800)
              .easing(Easing.out(Easing.quad))}
          >
            <Text style={[styles.mainHeading, { color: theme.text }]}>
              Take Control{"\n"}
              <Text style={{ color: colors.primary }}>Of Your Habits</Text>
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400)
              .duration(800)
              .easing(Easing.out(Easing.quad))}
          >
            <Text
              style={[
                styles.subHeading,
                { color: isDark ? colors.neutral300 : colors.neutral600 },
              ]}
            >
              Track your spending, understand your impact.
            </Text>
          </Animated.View>
        </View>
      </View>

      {/* Bottom Action Area */}
      <View
        style={[styles.footer, { paddingBottom: bottom + verticalScale(20) }]}
      >
        <Animated.View
          style={{ width: "100%" }}
          entering={FadeInDown.delay(600)
            .duration(800)
            .easing(Easing.out(Easing.quad))}
        >
          <TouchableButton
            loading={false}
            onPress={() => router.push("/(auth)/Register")}
            style={styles.getStartedBtn}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableButton>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(800)
            .duration(800)
            .easing(Easing.out(Easing.quad))}
          style={styles.loginContainer}
        >
          <Text style={[styles.loginText, { color: theme.text }]}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/Login")}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>
              Log In
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: scale(24),
  },
  imageContainer: {
    flex: 2, // Takes up more space
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  welcomeImage: {
    width: "100%",
    height: "100%",
    maxHeight: verticalScale(320),
  },
  textContainer: {
    flex: 1,
    gap: verticalScale(16),
    justifyContent: "flex-start", // Align towards top of this section
  },
  mainHeading: {
    fontSize: verticalScale(32),
    fontWeight: "800",
    textAlign: "left",
    lineHeight: verticalScale(40),
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: verticalScale(16),
    fontWeight: "400",
    textAlign: "left",
    lineHeight: verticalScale(24),
    paddingRight: scale(20), // Prevent text from hitting edge too hard
  },
  footer: {
    paddingHorizontal: scale(24),
    gap: verticalScale(20),
    alignItems: "center",
  },
  getStartedBtn: {
    // No shadow
  },
  getStartedText: {
    fontWeight: "700",
    fontSize: verticalScale(18),
    color: colors.neutral900, // or 'white' depending on button color in TouchableButton
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
