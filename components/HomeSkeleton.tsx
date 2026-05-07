import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

const SkeletonItem = ({
  width,
  height,
  borderRadius,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) => {
  const { isDark } = useTheme();
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.5, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const backgroundColor = isDark ? colors.neutral800 : colors.neutral200;

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: verticalScale(height),
          backgroundColor,
          borderRadius: borderRadius || scale(8),
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

const HomeSkeleton = () => {
  const { top } = require("react-native-safe-area-context").useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[styles.container, { paddingTop: top + 10 }]}
    >
      {/* Header Skeleton */}
      <View style={styles.header}>
        <View style={styles.userSection}>
          <SkeletonItem
            width={scale(48)}
            height={scale(48)}
            borderRadius={scale(24)}
          />
          <View style={{ gap: verticalScale(4) }}>
            <SkeletonItem width={scale(60)} height={12} />
            <SkeletonItem width={scale(100)} height={16} />
          </View>
        </View>
      </View>

      {/* Summary Card Skeleton */}
      <View style={{ marginTop: verticalScale(20), gap: verticalScale(10) }}>
        <SkeletonItem width={scale(80)} height={18} />
        <SkeletonItem width="100%" height={180} borderRadius={scale(24)} />
      </View>

      {/* Grid Skeleton */}
      <View style={{ marginTop: verticalScale(20), gap: verticalScale(10) }}>
        <SkeletonItem width={scale(80)} height={18} />
        <View style={styles.gridContainer}>
          {[1, 2, 3, 4].map((_, index) => (
            <SkeletonItem
              key={index}
              width={(width - scale(52)) / 2}
              height={120}
              borderRadius={scale(20)}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

export default HomeSkeleton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scale(20),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: verticalScale(12),
    justifyContent: "space-between",
  },
});
