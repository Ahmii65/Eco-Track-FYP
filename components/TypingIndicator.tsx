import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";

const Dot = ({ index }: { index: number }) => {
  const { theme, isDark } = useTheme();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      index * 200,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.3, { duration: 500 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        {
          scale: opacity.value,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        animatedStyle,
        {
          backgroundColor: isDark ? colors.neutral500 : colors.neutral600,
        },
      ]}
    />
  );
};

const TypingIndicator = () => {
  const { theme, isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isDark ? colors.neutral800 : colors.neutral200,
            borderBottomLeftRadius: 0,
          },
        ]}
      >
        <View style={styles.dotsContainer}>
          <Dot index={0} />
          <Dot index={1} />
          <Dot index={2} />
        </View>
      </View>
    </View>
  );
};

export default TypingIndicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: verticalScale(5),
    width: "100%",
    justifyContent: "flex-start",
  },
  bubble: {
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(15),
    borderRadius: verticalScale(15),
    minWidth: scale(60),
    alignItems: "center",
    justifyContent: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: scale(4),
  },
  dot: {
    width: scale(6),
    height: scale(6),
    borderRadius: scale(3),
  },
});
