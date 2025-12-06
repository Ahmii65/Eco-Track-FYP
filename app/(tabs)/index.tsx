import GeminiChat from "@/components/GeminiChat";
import HomeBoxes from "@/components/HomeBoxes";
import HomeHeader from "@/components/HomeHeader";
import HomeSummaryCard from "@/components/HomeSummaryCard";
import { homeBoxes } from "@/constants/data";
import { colors } from "@/constants/theme";
import useTheme from "@/hooks/useColorScheme";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ChatsCircleIcon } from "phosphor-react-native";
import React, { useMemo, useRef } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const Home = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
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
    <View
      style={[
        styles.main,
        {
          backgroundColor: theme.background,
          paddingTop: top + 5,
        },
      ]}
    >
      <HomeHeader />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: verticalScale(15),
          paddingBottom: verticalScale(100),
        }}
      >
        <HomeSummaryCard />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: verticalScale(10),
            justifyContent: "center",
            flex: 1,
          }}
        >
          {homeBoxes.length > 0 &&
            homeBoxes.map((item, index) => {
              return <HomeBoxes key={index} item={item} />;
            })}
        </View>
      </ScrollView>
      <AnimatedPressable
        style={[styles.fab, fabAnimatedStyle]}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() => {
          bottomSheetModalRef.current?.present();
        }}
      >
        <ChatsCircleIcon color={colors.white} size={35} />
      </AnimatedPressable>
      <GeminiChat bottomSheetModalRef={bottomSheetModalRef} />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20), gap: verticalScale(20) },
  fab: {
    position: "absolute",
    bottom: 40,
    right: scale(20),
    backgroundColor: "#0D9488",
    height: scale(60),
    width: scale(60),
    borderRadius: scale(20),
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});
