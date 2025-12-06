import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";

const AnimatedPressable = useMemo(() => {
  return Animated.createAnimatedComponent(Pressable);
}, []);

const HomeBoxes = ({ item, index }: any) => {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const onPressIn = () => {
    scaleValue.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scaleValue.value = withSpring(1);
  };

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={() => router.push(item.value)}
      style={[
        {
          width: "48%",
          height: verticalScale(110),
          borderRadius: verticalScale(20),
          overflow: "hidden", // Ensures gradient respects border radius
        },
        animatedStyle,
      ]}
    >
      <LinearGradient
        colors={[item.bgColor, item.bgColor + "90"]} // Solid to slight fade
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          padding: scale(15),
          justifyContent: "space-between",
        }}
      >
        {/* Icon Circle */}
        <item.icon
          color="#FFF"
          weight="fill"
          size={verticalScale(28)}
          style={{ opacity: 0.9 }}
        />

        {/* Text Section */}
        <Text
          style={{
            color: "#FFF",
            fontSize: verticalScale(14),
            fontWeight: "700",
            opacity: 0.9,
          }}
        >
          {item.label}
        </Text>
      </LinearGradient>
    </AnimatedPressable>
  );
};

export default HomeBoxes;
