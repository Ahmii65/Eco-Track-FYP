import HomeBoxes from "@/components/HomeBoxes";
import HomeHeader from "@/components/HomeHeader";
import HomeSummaryCard from "@/components/HomeSummaryCard";
import { homeBoxes } from "@/constants/data";
import { colors } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { useAchievements } from "@/hooks/useAchievements";
import useTheme from "@/hooks/useColorScheme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ChatsCircleIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const Home = () => {
  const { theme, isDark } = useTheme();
  const { top } = useSafeAreaInsets();
  const { user } = useAuth();

  // Use Achievements hook to get real stats
  const { stats, loading } = useAchievements();

  const AnimatedPressable = useMemo(() => {
    return Animated.createAnimatedComponent(Pressable);
  }, []);

  const fab = useSharedValue(1);
  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: fab.value,
        },
      ],
    };
  });

  const onPressIn = () => {
    fab.value = withSpring(0.95);
  };
  const onPressOut = () => {
    fab.value = withSpring(1);
  };

  return (
    <View style={styles.container}>
      {/* Premium Background */}
      <LinearGradient
        colors={
          isDark
            ? [colors.neutral900, colors.neutral800]
            : [colors.neutral50, "#f0fdf4"] // Subtle green tint for eco theme
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View
        style={[
          styles.main,
          {
            paddingTop: top + 10,
          },
        ]}
      >
        <HomeHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: verticalScale(20),
            paddingBottom: verticalScale(100),
          }}
          style={{ flex: 1 }}
        >
          {/* Summary Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Overview
            </Text>
          </View>

          <HomeSummaryCard
            totalImpact={stats?.currentMonthImpact || 0}
            electricityUsage={stats?.currentMonthElectricity || 0}
            waterUsage={stats?.currentMonthWater || 0}
          />

          {/* Grid Section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Explore
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: verticalScale(12),
              justifyContent: "space-between",
            }}
          >
            {homeBoxes.length > 0 &&
              homeBoxes.map((item, index) => {
                return <HomeBoxes key={index} item={item} />;
              })}
          </View>
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <AnimatedPressable
        style={[styles.fabContainer, fabAnimatedStyle]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {
          router.push("/ChatScreen");
        }}
      >
        <LinearGradient
          colors={[colors.primary, "#0f766e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fab}
        >
          <ChatsCircleIcon color={colors.white} size={32} weight="fill" />
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingHorizontal: scale(20),
    gap: verticalScale(20),
  },
  sectionHeader: {
    marginBottom: verticalScale(-10), // pull closer to content or just spacing
    marginTop: verticalScale(5),
  },
  sectionTitle: {
    fontSize: verticalScale(18),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  fabContainer: {
    position: "absolute",
    bottom: verticalScale(30), // moved up slightly
    right: scale(20),
    shadowColor: "#0D9488",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  fab: {
    height: scale(56),
    width: scale(56),
    borderRadius: scale(18),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});
