import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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
          width: "47%",
          height: verticalScale(110),
          borderRadius: verticalScale(20),
          // Shadow
          shadowColor: item.bgColor,
          shadowOffset: {
            width: 0,
            height: 8,
          },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
          backgroundColor: item.bgColor,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          flex: 1,
          borderRadius: verticalScale(20),
          overflow: "hidden",
        }}
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
      </View>
    </AnimatedPressable>
  );
};

export default HomeBoxes;
