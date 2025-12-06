import CarbonFootprint from "@/components/CarbonFootprint";
import Expenses from "@/components/Expenses";
import useTheme from "@/hooks/useColorScheme";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";

const Statistics = () => {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
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
      <Text
        style={{
          fontSize: scale(20),
          fontWeight: "bold",
          color: theme.text,
          alignSelf: "center",
        }}
      >
        Statistics
      </Text>
      <SegmentedControl
        values={["Carbon Footprint", "Expenses"]}
        selectedIndex={selectedIndex}
        style={{ height: verticalScale(40) }}
        onChange={(event) => {
          setSelectedIndex(event.nativeEvent.selectedSegmentIndex);
        }}
      />
      {selectedIndex === 0 ? <CarbonFootprint /> : <Expenses />}
    </View>
  );
};

export default Statistics;

const styles = StyleSheet.create({
  main: { flex: 1, paddingHorizontal: scale(20), gap: verticalScale(13) },
});
