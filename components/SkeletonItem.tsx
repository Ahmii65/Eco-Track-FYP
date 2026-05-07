import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { scale } from "react-native-size-matters";

interface SkeletonItemProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}

const SkeletonItem = ({
  width,
  height,
  borderRadius,
  style,
}: SkeletonItemProps) => {
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
          height: height as any,
          backgroundColor,
          borderRadius: borderRadius || scale(8),
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export default SkeletonItem;
