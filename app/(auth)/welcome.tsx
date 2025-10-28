import TouchableButton from "@/components/TouchableButton";
import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const Welcome = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { isDark, theme } = useTheme();
  const [loading, setloading] = useState<boolean>(false);
  return (
    <View
      style={[
        styles.main,
        { paddingTop: top + 5, backgroundColor: theme.background },
      ]}
    >
      {/* Login Button and Image */}
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/Login")}
        >
          <Text style={[styles.buttonText, { color: theme.text }]}>
            Sign in
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.Image
            entering={FadeIn.duration(500)}
            source={require("../../assets/images/welcome.png")}
            resizeMode="contain"
            style={styles.welcomeImage}
          />
        </View>
      </View>
      {/* footer */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.background,
            shadowColor: isDark ? "white" : "black",
            paddingBottom: bottom + verticalScale(12),
          },
        ]}
      >
        <Animated.View
          style={{ alignItems: "center" }}
          entering={FadeInDown.duration(1000)
            .springify()
            .mass(1)
            .damping(22)
            .stiffness(70)}
        >
          <Text
            style={[
              styles.footerText1,
              { color: theme.text, letterSpacing: 1 },
            ]}
          >
            Always take control of your habits
          </Text>
        </Animated.View>
        <Animated.View
          style={{ alignItems: "center", gap: 2 }}
          entering={FadeInDown.delay(200)
            .springify()
            .mass(1)
            .damping(22)
            .stiffness(70)}
        >
          <Text
            style={[
              styles.footerText2,
              { color: isDark ? colors.textLight : "black" },
            ]}
          >
            Track your spending, understand your impact. Live smarter, live
            greener.
          </Text>
        </Animated.View>
        <Animated.View
          style={{ width: "100%" }}
          entering={FadeInDown.delay(400)
            .springify()
            .mass(1)
            .damping(22)
            .stiffness(70)}
        >
          <TouchableButton
            loading={loading}
            onPress={() => router.push("/(auth)/Register")}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 22,
                color: colors.neutral900,
              }}
            >
              Get Started
            </Text>
          </TouchableButton>
        </Animated.View>
      </View>
    </View>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  button: {
    alignSelf: "flex-end",
    paddingRight: scale(20),
  },
  buttonText: {
    fontWeight: "500",
    fontSize: verticalScale(19),
  },
  welcomeImage: {
    width: "100%",
    alignSelf: "center",
    height: verticalScale(300),
  },
  footer: {
    alignItems: "center",
    paddingTop: verticalScale(12
      
      
      ),
    elevation: 20,
    gap: verticalScale(12),
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    paddingHorizontal: scale(20),
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  footerText1: {
    color: "white",
    fontWeight: "800",
    fontSize: verticalScale(28),
    textAlign: "center",
  },
  footerText2: {
    fontSize: verticalScale(14),
    fontWeight: "400",
    textAlign: "center",
  },
});
