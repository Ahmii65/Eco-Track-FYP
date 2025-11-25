import { IconWeight } from "phosphor-react-native";
import React, { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface AnimatedTabIconsProps {
  focused: boolean;
  size: number;
  weight: IconWeight;
  color: string;
  Icon: React.ComponentType<{
    focused: boolean;
    size: number;
    color: string;
    weight?: IconWeight;
  }>;
}

const AnimatedTabIcons = ({
  focused,
  size,
  color,
  Icon,
  weight,
}: AnimatedTabIconsProps) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  useEffect(() => {
    scale.value = withSpring(focused ? 1.2 : 1, {
      damping: 10,
      stiffness: 200,
      mass: 0.5,
    });
    opacity.value = withTiming(focused ? 1 : 0.9, { duration: 200 });
  }, [focused]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  return (
    <Animated.View style={animatedStyles}>
      <Icon focused={focused} size={size} color={color} weight={weight} />
    </Animated.View>
  );
};

export default AnimatedTabIcons;
